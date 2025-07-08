import { Controller, Inject, Logger, Sse, UseGuards } from '@nestjs/common';
import { SseJwtAuthGuard } from "../auth";
import { AuthQuerySchema, User, UserNotificationEvent } from "../common";
import { EventBus } from "@nestjs/cqrs";
import { filter, fromEvent, map, Observable, startWith, tap } from "rxjs";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserNotificationSchema } from "./api";
import { EventEmitter2 } from "@nestjs/event-emitter";

@ApiTags("Notifications")
@Controller('/api/notifications')
@UseGuards(SseJwtAuthGuard)
export class NotificationsController {
    private readonly _logger: Logger = new Logger(NotificationsController.name);

    constructor(
       @Inject(EventBus)
       private readonly _eventBus: EventBus,
       @Inject(EventEmitter2)
       private readonly _eventEmitter: EventEmitter2
    ) {}

    @Sse("/")
    @ApiOperation({ summary: "sse endpoint" })
    @ApiQuery({ type: AuthQuerySchema, required: true })
    @ApiOkResponse({ type: UserNotificationSchema })
    notifyUser(@User("id") userId: number): Observable<UserNotificationSchema> {
        return fromEvent(this._eventEmitter, `user.${userId}.event`)
            .pipe(
                startWith(new UserNotificationEvent({
                    userId,
                    type: "start",
                    payload: {}
                })),
                map(msg => msg as UserNotificationEvent),
                map(({ type, payload }): UserNotificationSchema =>
                    ({ type, payload })),
                tap(result => this._logger.log(JSON.stringify(result)))
            );
    }

}


