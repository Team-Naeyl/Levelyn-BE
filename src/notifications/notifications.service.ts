import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserNotification } from "./notification";
import Redis from "ioredis";

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

    async* getUserNotifications(userId: number): AsyncIterableIterator<UserNotification> {
        const key = __makeKey(userId);

        while (true) {
            const raw = await this._redis.lpop(key);
            if (!raw) continue;

            this._logger.debug(raw);
            await this._redis.rpush(`${key}:done`, raw);
            const msg = JSON.parse(raw) as UserNotification;

            yield msg;
        }
    }


}

function __makeKey(userId: number): string {
    return `user:${userId}`;
}

