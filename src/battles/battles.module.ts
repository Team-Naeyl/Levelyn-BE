import { Module } from '@nestjs/common';
import { RedisModule } from "../config/redis";
import { MonsterSchema, SkillSchema, StatSchema } from "./schema";
import { InventoryModule, UserItemsService, UserSkillsService } from "../inventory";
import { StatesModule, UserStatesService } from "../states";
import { GameModule, MonstersService } from "../game";
import { BattlesListener } from "./battles.listener";
import { CreateBattleHandler, StartBattleHandler } from "./handler";

const EXTERNAL_PROVIDERS = [
    UserItemsService,
    UserSkillsService,
    UserStatesService,
    MonstersService
]

@Module({
  imports: [
      RedisModule.forFeature([StatSchema, SkillSchema, MonsterSchema]),
      InventoryModule,
      StatesModule,
      GameModule
  ],
  providers: [
      ...EXTERNAL_PROVIDERS,
      BattlesListener,
      CreateBattleHandler,
      StartBattleHandler
  ]
})
export class BattlesModule {}
