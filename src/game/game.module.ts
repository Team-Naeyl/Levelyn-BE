import { Module } from "@nestjs/common";
import { Skill, SkillsModule, SkillsService } from "./skills";
import { Item, ItemsModule, ItemsService } from "./items";
import { Monster, MonstersModule, MonstersService } from "./monsters";
import { TypeOrmModule } from "@nestjs/typeorm";
import { YamlConfigModule } from "../config/yaml-config";
import { RegionConfig, RewardConfig } from "./config";
import { Region, RegionsModule, RegionsService } from "./regions";

@Module({
    imports: [
        TypeOrmModule.forFeature([Skill, Item, Monster, Region]),
        YamlConfigModule.forFeature([RegionConfig, RewardConfig]),
        SkillsModule,
        ItemsModule,
        MonstersModule,
        RegionsModule
    ],
    providers: [
        SkillsService,
        ItemsService,
        MonstersService,
        RegionsService
    ],
    exports: [
        SkillsService,
        ItemsService,
        MonstersService,
        RegionsService
    ]
})
export class GameModule {}