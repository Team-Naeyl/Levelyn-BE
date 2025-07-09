import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserNotification } from "./notification";
import Redis from "ioredis";
import { map, pipe } from "@fxts/core";
import { NOTIFICATION_BLOCK_TIMEOUT } from "./token";

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

    getUserNotifications(userId: number): AsyncIterableIterator<UserNotification> {
        return pipe(
            __makeKey(userId),
            key => this.generateRaws(key),
            map(raw => JSON.parse(raw) as UserNotification)
        );
    }

    private async* generateRaws(key: string): AsyncIterableIterator<string> {
        while (true) {

            const raw = await this._redis.blpop(key, this._timeout)
                .then(result => result && result[1])
                .catch(err => {
                    this._logger.error(err);
                    return null;
                });

            if (!raw) continue;

            await this._redis.rpush(
                `${key}:done`,
                JSON.stringify({ at: new Date(), msg: raw })
            );

            yield raw;
        }
    }


}

function __makeKey(userId: number): string {
    return `user:${userId}`;
}

