import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserNotification } from "./notification";
import Redis from "ioredis";
import { NOTIFICATION_BLOCK_TIMEOUT } from "./token";
import { from, map, Observable, tap } from "rxjs";

@Injectable()
export class NotificationsService {
    private readonly _logger: Logger = new Logger(NotificationsService.name);

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis,
       @Inject(NOTIFICATION_BLOCK_TIMEOUT)
       private readonly _timeout: number,
    ) {}

    async addUserNotification(
        userId: number,
        notification: UserNotification
    ): Promise<void> {
        await this._redis.rpush(
            __makeKey(userId),
            JSON.stringify(notification)
        );
    }

    getUserNotifications(userId: number): Observable<UserNotification> {
       return from(this.generateRaws(__makeKey(userId)))
           .pipe(
               tap(raw => this._logger.debug(raw)),
               map(raw => JSON.parse(raw))
           );
    }

    private async* generateRaws(key: string): AsyncIterableIterator<string> {
        while (true) {
            const raw = await this._redis.lpop(key);

            if (!raw) {
                await new Promise(resolve =>
                    setTimeout(resolve, this._timeout)
                );

                continue;
            }

            await this._redis.rpush(
                `${key}:done`,
                JSON.stringify({ at: new Date(), msg: raw })
            );

            this._logger.debug(raw);
            yield raw;
        }
    }


}

function __makeKey(userId: number): string {
    return `user:${userId}`;
}

