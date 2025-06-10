import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserItem, UserSkill } from "./model";
import { Skill, SkillsModule, SkillsService } from "../skills";
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";
import { UserItemsService, UserSkillsService } from "./service";
import { UserItemsController, UserSkillsController } from "./controller";

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
      UserSkillsService
  ],
  controllers: [UserItemsController, UserSkillsController],
  exports: [UserItemsService, UserSkillsService]
})
export class InventoryModule {}
