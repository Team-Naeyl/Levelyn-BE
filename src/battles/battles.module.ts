import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { YamlConfigModule } from "../config/yaml-config";
import { BattleConfig, GameModule, Monster, MonstersService, Region, RegionConfig, RegionsService } from "../game";
import { GachaModule } from "../gacha";
import { omit } from "@fxts/core";
import { InventoryModule, PlayerItem, PlayerItemsService, PlayerSkill, PlayerSkillsService } from "../inventory";
import { Player } from "../players/model";
import { PlayersModule, PlayersService } from "../players";
import { BATTLE_EXP_REWARD } from "./token";
import { BattleRewardsService, BattlesService } from "./service";

const EXTERNAL_PROVIDERS = [
  PlayersService,
  PlayerItemsService,
  PlayerSkillsService,
  RegionsService,
  MonstersService
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Player, PlayerItem, PlayerSkill, Region, Monster]),
        YamlConfigModule.forFeature([BattleConfig, RegionConfig]),
        GachaModule.registerAsync({
            optionsFactory: ({ reward }: BattleConfig) => omit(["exp"],reward),
            inject: [BattleConfig]
        }),
        PlayersModule,
        InventoryModule,
        GameModule
    ],
    providers: [
        ...EXTERNAL_PROVIDERS,
        BattlesService,
        BattleRewardsService,
        {
            provide: BATTLE_EXP_REWARD,
            useFactory: ({ reward: { exp } }: BattleConfig) => exp,
            inject: [BattleConfig]
        }
    ]
})
export class BattlesModule {}
