import { Module } from "@nestjs/common";
import { NotificationsController } from './notifications.controller';
import { AuthModule, SseJwtAuthGuard } from "../auth";
import { NotificationsService } from "./service/notifications.service";
import { UserEventHandler } from "./user.event.handler";
import { OptionsProvider } from "../common";
import { NOTIFICATION_BLOCK_TIMEOUT, SSE_HEARTBEAT_PERIOD } from "./token";
import { NotificationsInterceptor } from "./notifications.interceptor";

const EXTERNAL_PROVIDERS = [SseJwtAuthGuard]

@Module({
  imports: [AuthModule],
  providers: [
      ...EXTERNAL_PROVIDERS,
      NotificationsService,
      NotificationsInterceptor,
      UserEventHandler,
      OptionsProvider<number>(NOTIFICATION_BLOCK_TIMEOUT),
      OptionsProvider<number>(SSE_HEARTBEAT_PERIOD)
  ],
  controllers: [NotificationsController]
})
export class NotificationsModule {}