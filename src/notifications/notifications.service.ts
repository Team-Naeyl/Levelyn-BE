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
        await this._redis.xadd(
            __makeKey(userId),
            "*",
            "notification",
            JSON.stringify(notification)
        );
    }

    async* getUserNotifications(userId: number): AsyncIterableIterator<UserNotification> {
        const key = __makeKey(userId);

        while (true) {

            const streams = await this._redis.xread(
                "COUNT", 5,
                "BLOCK", 0,
                "STREAMS", key, "$"
            );

            streams && this._logger.log(JSON.stringify(streams));
            const [, stream] = streams![0];

            yield* stream.map(([, fields]) =>
                JSON.parse(fields[1]) as UserNotification
            );
        }
    }
}

function __makeKey(userId: number): string {
    return `user:${userId}`;
}

