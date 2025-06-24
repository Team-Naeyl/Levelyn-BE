import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerItem, UserSkill } from "./model";
import { AuthModule, JwtAuthGuard } from "../auth";
import { PlayerItemsService, PlayerSkillsService } from "./service";
import { PlayerItemsController, PlayerSkillsController } from "./controller";
import { InventoryListener } from "./inventory.listener";

const EXTERNAL_PROVIDERS = [JwtAuthGuard];

@Module({
  imports: [
      TypeOrmModule.forFeature([PlayerItem, UserSkill]),
      AuthModule
  ],
  providers: [
      ...EXTERNAL_PROVIDERS,
      PlayerItemsService,
      PlayerSkillsService,
      InventoryListener
  ],
  controllers: [PlayerItemsController, PlayerSkillsController],
  exports: [PlayerItemsService, PlayerSkillsService]
})
export class InventoryModule {}
