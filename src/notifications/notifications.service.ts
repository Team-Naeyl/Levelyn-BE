import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserNotification } from "./notification";
import Redis from "ioredis";
import { map, pipe } from "@fxts/core";

@Injectable()
export class NotificationsService {
    private readonly _logger: Logger = new Logger(NotificationsService.name);

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis,
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
            const raw = await this._redis.lpop(key);
            if (!raw) continue;
            this._logger.debug(raw);
            yield raw;
        }
    }


}

function __makeKey(userId: number): string {
    return `user:${userId}`;
}

