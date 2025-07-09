import { Controller, Inject, Sse, UseGuards, UseInterceptors } from '@nestjs/common';
import { SseJwtAuthGuard } from "../auth";
import { AuthQuerySchema, SseInterceptor, User } from "../common";
import { from, interval, map, merge, Observable } from "rxjs";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { NotificationSchema } from "./api";
import { NotificationsService } from "./notifications.service";

@ApiTags("Notifications")
@Controller('/api/notifications')
@UseGuards(SseJwtAuthGuard)
@UseInterceptors(SseInterceptor)
export class NotificationsController {

    constructor(
        @Inject(NotificationsService)
        private readonly _notificationsService: NotificationsService,
    ) {}

    @Sse("/")
    @ApiOperation({ summary: "sse endpoint" })
    @ApiQuery({ type: AuthQuerySchema, required: true })
    @ApiOkResponse({ type: NotificationSchema })
    notifyUser(@User("id") userId: number): Observable<NotificationSchema> {
        return merge(
            interval(15000).pipe(
                map(() => ({ event: "ping", data: null }))
            ),
            this._notificationsService.getUserNotifications(userId)
        );
    }
}


