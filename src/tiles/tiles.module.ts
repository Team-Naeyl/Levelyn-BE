import { Module } from '@nestjs/common';
import { YamlConfigModule } from "../config/yaml-config";
import { TileConfig } from "../game";
import { GachaModule, GachaService } from "../gacha";
import { omit } from "@fxts/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TilesController } from './tiles.controller';
import { TilesService } from './tiles.service';
import { IS_BATTLE_EVENT, TILE_EXP_REWARD } from "./token";
import { Random } from "random";
import { AuthModule, JwtAuthGuard } from "../auth";

const EXTERNAL_PROVIDERS = [GachaService, JwtAuthGuard];

@Module({
    imports: [
        TypeOrmModule.forFeature([]),
        YamlConfigModule.forFeature([TileConfig]),
        GachaModule.registerAsync({
            optionsFactory: ({ reward }: TileConfig) => omit(["exp"], reward),
            inject: [TileConfig]
        }),
        AuthModule
    ],
    providers: [
        ...EXTERNAL_PROVIDERS,
        TilesService,
        {
            provide: TILE_EXP_REWARD,
            useFactory: ({ reward: { exp } }: TileConfig) => exp,
            inject: [TileConfig]
        },
        {
            provide: IS_BATTLE_EVENT,
            useFactory: (
                random: Random,
                { pBattleEvent }: TileConfig
            ) => {
                const dist = random.binomial(1, pBattleEvent);
                return () => Boolean(dist());
            },
            inject: [Random, TileConfig]
        }
    ],
    controllers: [TilesController]
})
export class TilesModule {}
