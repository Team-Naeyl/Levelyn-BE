import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Player } from "./model";
import { PlayersService, LevelUpService } from './service';
import { YamlConfigModule } from "../config/yaml-config";
import { LevelConfig } from "../game";
import { PlayersListener } from "./players.listener";

@Module({
    imports: [
        TypeOrmModule.forFeature([Player]),
        YamlConfigModule.forFeature([LevelConfig])
    ],
    providers: [
        PlayersListener,
        PlayersService,
        LevelUpService
    ],
    exports: [PlayersService, LevelUpService]
})
export class PlayersModule {}
