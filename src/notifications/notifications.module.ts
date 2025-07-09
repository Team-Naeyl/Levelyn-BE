import { Module } from "@nestjs/common";
import { NotificationsController } from './notifications.controller';
import { AuthModule, SseJwtAuthGuard } from "../auth";
import { NotificationsService } from "./notifications.service";
import { UserEventHandler } from "./user.event.handler";

const EXTERNAL_PROVIDERS = [SseJwtAuthGuard]

@Module({
  imports: [AuthModule],
  providers: [
      ...EXTERNAL_PROVIDERS,
      NotificationsService,
      UserEventHandler
  ],
  controllers: [NotificationsController]
})
export class NotificationsModule {}