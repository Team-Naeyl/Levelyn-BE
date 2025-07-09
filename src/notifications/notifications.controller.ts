import { Controller, Inject, Sse, UseGuards, UseInterceptors } from '@nestjs/common';
import { SseJwtAuthGuard } from "../auth";
import { AuthQuerySchema, SseInterceptor, User, UserEvent } from "../common";
import { from, fromEvent, interval, map, merge, Observable, tap } from "rxjs";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { NotificationSchema } from "./api";
import { NotificationsService } from "./notifications.service";
import { EventEmitter2 } from "@nestjs/event-emitter";

@ApiTags("Notifications")
@Controller('/api/notifications')
@UseGuards(SseJwtAuthGuard)
@UseInterceptors(SseInterceptor)
export class NotificationsController {

    constructor(
        @Inject(NotificationsService)
        private readonly _notificationsService: NotificationsService,
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2
    ) {}

    @Sse("/")
    @ApiOperation({ summary: "sse endpoint" })
    @ApiQuery({ type: AuthQuerySchema, required: true })
    @ApiOkResponse({ type: NotificationSchema })
    notifyUser(@User("id") userId: number): Observable<NotificationSchema> {
        return fromEvent(this._eventEmitter, `user.${userId}.event`)
            .pipe(
                tap(msg => JSON.stringify(msg)),
                map(msg => msg as UserEvent),
                map(({ userId, ...rest }) => rest)
            );
    }
}


