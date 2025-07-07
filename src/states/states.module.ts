import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { YamlConfigModule } from "../config/yaml-config";
import { GameModule, LevelConfig, Skill, SkillsService } from "../game";
import { State } from "./state.model";
import { UpdateStateHandler } from "./update.state.handler";
import { StatesService } from "./states.service";

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
        UpdateStateHandler
    ],
    exports: [StatesService],
})
export class StatesModule {}
