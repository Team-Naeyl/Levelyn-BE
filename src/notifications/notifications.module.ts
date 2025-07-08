import { Module } from "@nestjs/common";
import { NotificationsController } from './notifications.controller';
import { AuthModule, SseJwtAuthGuard } from "../auth";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [AuthModule],
  providers: [SseJwtAuthGuard, NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule {}