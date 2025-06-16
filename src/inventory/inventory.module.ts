import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserItem, UserSkill } from "./model";
import { Skill, SkillsModule, SkillsService } from "../skills";
import { AuthModule, JwtAuthGuard } from "../auth";
import { UserItemsService, UserSkillsService } from "./service";
import { UserItemsController, UserSkillsController } from "./controller";
import { InventoryListener } from "./inventory.listener";

const EXTERNAL_PROVIDERS = [SkillsService, JwtAuthGuard];

@Module({
  imports: [
      TypeOrmModule.forFeature([UserItem, UserSkill, Skill]),
      SkillsModule,
      AuthModule
  ],
  providers: [
      ...EXTERNAL_PROVIDERS,
      UserItemsService,
      UserSkillsService,
      InventoryListener
  ],
  controllers: [UserItemsController, UserSkillsController],
  exports: [UserItemsService, UserSkillsService]
})
export class InventoryModule {}
