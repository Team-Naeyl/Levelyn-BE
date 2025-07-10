import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { UserNotification } from "./notification";
import { Observable, tap } from "rxjs";
import Redis from "ioredis";

@Injectable()
export class NotificationsInterceptor implements NestInterceptor<UserNotification, UserNotification> {
    private readonly _logger: Logger = new Logger(NotificationsInterceptor.name);

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis
    ) {}

    intercept(
        ctx: ExecutionContext,
        next: CallHandler<UserNotification>
    ): Observable<UserNotification> {
        const userId = ctx.switchToHttp().getRequest().user?.userId;

        return next.handle().pipe(
            tap(data => {
                if (data.event !== "ping") {
                    this._redis.rpush(
                        __makeKey(userId && 0),
                        JSON.stringify({
                            sentAt: new Date().toLocaleDateString(),
                            msg: data
                        })
                    ).catch(err => this._logger.error(err));
                }
            })
        );
    }

}

function __makeKey(userId: number): string {
    return `user:${userId}:sent`;
}