import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserNotification } from "./notification";
import Redis from "ioredis";
import { isString, pipe, map, takeWhile, concat } from "@fxts/core";

@Injectable()
export class NotificationsService {
    private readonly _logger: Logger = new Logger(NotificationsService.name);

    constructor(
        @Inject(Redis)
        private readonly _redis: Redis
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
            key => this.generate(key),
            takeWhile(isString),
            map(raw => JSON.parse(raw!) as UserNotification),
            concat([new UserNotification("START", null)])
        );
    }

    private async* generate(key: string): AsyncIterableIterator<string | null> {
        while (true) yield await this._redis.lpop(key);
    }
}

function __makeKey(userId: number): string {
    return `user:${userId}`;
}