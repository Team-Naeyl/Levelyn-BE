import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { State } from "./model";
import { YamlConfigModule } from "../config/yaml-config";
import { GameModule, LevelConfig, Skill, SkillsService } from "../game";
import { StatesService, UnlockSkillsService } from "./service";
import { UpdateStateHandler } from "./handler";

const EXTERNAL_PROVIDERS = [SkillsService];

@Module({
    imports: [
        TypeOrmModule.forFeature([State, Skill]),
        YamlConfigModule.forFeature([LevelConfig]),
        GameModule
    ],
    providers: [
        ...EXTERNAL_PROVIDERS,
        StatesService,
        UnlockSkillsService,
        UpdateStateHandler
    ],
    exports: [
        StatesService,
        UnlockSkillsService
    ],
})
export class StatesModule {}
