import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InventoryModule, UserItem, UserItemsService, UserSkill, UserSkillsService } from "../inventory";
import { BattleConfig, GameModule, Monster, MonstersService, Region, RegionConfig, RegionsService } from "../game";
import { StatesModule, StatesService } from "../states";
import { YamlConfigModule } from "../config/yaml-config";
import { ApplyItemsService, BattlesService, CreateBattleService, ExecuteBattleService, LoadMobService, LoadPlayerService } from "./service";
import { CreateBattleHandler } from "./handler";
import { AuthModule } from "../auth";
import { BattlesController } from "./battles.controller";
import { BattlesSaga } from "./battles.saga";
import { State } from "../states/state.model";
import { BattlesRepository } from "./battles.repository";

const EXTERNAL_PROVIDERS = [
    StatesService,
    UserItemsService,
    UserSkillsService,
    MonstersService,
    RegionsService
]

@Module({
  imports: [
      TypeOrmModule.forFeature([State, UserItem, UserSkill, Monster, Region]),
      YamlConfigModule.forFeature([BattleConfig, RegionConfig]),
      AuthModule,
      StatesModule,
      InventoryModule,
      GameModule
  ],
  providers: [
      ...EXTERNAL_PROVIDERS,
      BattlesService,
      CreateBattleService,
      LoadPlayerService,
      LoadMobService,
      ApplyItemsService,
      ExecuteBattleService,
      CreateBattleHandler,
      BattlesSaga,
      BattlesRepository
  ],
  controllers: [BattlesController]
})
export class BattlesModule {}