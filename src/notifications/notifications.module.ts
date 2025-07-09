import { Module } from "@nestjs/common";
import { NotificationsController } from './notifications.controller';
import { AuthModule, SseJwtAuthGuard } from "../auth";
import { NotificationsService } from "./notifications.service";
import { UserEventHandler } from "./user.event.handler";
import { OptionsProvider } from "../common";
import { NOTIFICATION_BLOCK_TIMEOUT } from "./token";

const EXTERNAL_PROVIDERS = [SseJwtAuthGuard]

@Module({
  imports: [AuthModule],
  providers: [
      ...EXTERNAL_PROVIDERS,
      NotificationsService,
      UserEventHandler,
      OptionsProvider<number>(NOTIFICATION_BLOCK_TIMEOUT)
  ],
  controllers: [NotificationsController]
})
export class NotificationsModule {}