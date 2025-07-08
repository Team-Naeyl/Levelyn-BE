import { Controller, Inject, Logger, Sse, UseGuards } from '@nestjs/common';
import { SseJwtAuthGuard } from "../auth";
import { AuthQuerySchema, User } from "../common";
import { Observable, tap } from "rxjs";
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { NotificationSchema } from "./api";
import { NotificationsService } from "./notifications.service";

@ApiTags("Notifications")
@Controller('/api/notifications')
@UseGuards(SseJwtAuthGuard)
export class NotificationsController {
    private readonly _logger: Logger = new Logger(NotificationsController.name);

    constructor(
        @Inject(NotificationsService)
        private readonly _notificationsService: NotificationsService,
    ) {}

    @Sse("/")
    @ApiOperation({ summary: "sse endpoint" })
    @ApiQuery({ type: AuthQuerySchema, required: true })
    @ApiOkResponse({ type: NotificationSchema })
    notifyUser(@User("id") userId: number): Observable<NotificationSchema> {
        return this._notificationsService.getUserStream(userId)
            .pipe(tap(data => this._logger.log(data)));
    }

}


