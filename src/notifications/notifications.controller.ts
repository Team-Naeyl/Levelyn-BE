import { Controller, Inject, Logger, Sse, UseGuards } from '@nestjs/common';
import { SseJwtAuthGuard } from "../auth";
import { AuthQuerySchema, User, UserNotificationEvent } from "../common";
import { EventBus } from "@nestjs/cqrs";
import { filter, map, Observable, tap } from "rxjs";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserNotificationSchema } from "./api";

@ApiTags("Notifications")
@Controller('/api/notifications')
@UseGuards(SseJwtAuthGuard)
export class NotificationsController {
    private readonly _logger: Logger = new Logger(NotificationsController.name);

    constructor(
       @Inject(EventBus)
       private readonly _eventBus: EventBus,
    ) {}

    @Sse("/")
    @ApiOperation({ summary: "sse endpoint" })
    @ApiQuery({ type: AuthQuerySchema, required: true })
    @ApiOkResponse({ type: UserNotificationSchema })
    notifyUser(@User("id") userId: number): Observable<UserNotificationSchema> {
        return this._eventBus.pipe(
            filter((msg): msg is UserNotificationEvent =>
                msg instanceof UserNotificationEvent
            ),
            tap((msg) => {
                this._logger.log(`${userId} : ${msg.userId}`);
            }),
            filter((msg: UserNotificationEvent) => msg.userId === userId),
            map(({ type, payload }) => ({ type, payload })),
            tap(response => this._logger.log(JSON.stringify(response)))
        );
    }

}


