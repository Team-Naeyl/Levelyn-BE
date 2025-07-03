import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserItem, UserSkill } from "./model";
import { AuthModule, JwtAuthGuard } from "../auth";
import { UserItemsService, UserSkillsService } from "./service";
import { UserItemsController, UserSkillsController } from "./controller";
import { GameModule, Skill, SkillsService } from "../game";
import { AddUserItemsHandler } from "./handler/add.user.items.handler";
import { AddUserSkillsHandler } from "./handler";

const EXTERNAL_PROVIDERS = [JwtAuthGuard, SkillsService];

@Module({
  imports: [
      TypeOrmModule.forFeature([UserItem, UserSkill, Skill]),
      AuthModule,
      GameModule
  ],
  providers: [
      ...EXTERNAL_PROVIDERS,
      UserItemsService,
      UserSkillsService,
      AddUserItemsHandler,
      AddUserSkillsHandler
  ],
  controllers: [UserItemsController, UserSkillsController],
  exports: [UserItemsService, UserSkillsService]
})
export class InventoryModule {}
