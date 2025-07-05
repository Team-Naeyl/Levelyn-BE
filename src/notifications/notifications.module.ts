import { Module } from "@nestjs/common";
import { NotificationsController } from './notifications.controller';
import { AuthModule, SseJwtAuthGuard } from "../auth";

@Module({
  imports: [AuthModule],
  providers: [SseJwtAuthGuard],
  controllers: [NotificationsController]
})
export class NotificationsModule {}