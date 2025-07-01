import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { State } from "./model";
import { YamlConfigModule } from "../config/yaml-config";
import { GameModule, LevelConfig, Skill, SkillsService } from "../game";
import { StatesController } from './states.controller';
import { StatesService, UnlockSkillsService } from "./service";
import { AuthModule, JwtAuthGuard } from "../auth";

const EXTERNAL_PROVIDERS = [
    SkillsService,
    JwtAuthGuard
]

@Module({
    imports: [
        TypeOrmModule.forFeature([State, Skill]),
        YamlConfigModule.forFeature([LevelConfig]),
        GameModule,
        AuthModule
    ],
    providers: [
        ...EXTERNAL_PROVIDERS,
        StatesService,
        UnlockSkillsService
    ],
    controllers: [StatesController],
    exports: [
        ...EXTERNAL_PROVIDERS,
        StatesService,
        UnlockSkillsService
    ],
})
export class StatesModule {}
