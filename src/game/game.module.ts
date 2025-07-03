import { Module } from "@nestjs/common";
import { Skill, SkillsModule, SkillsService } from "./skills";
import { Item, ItemsModule, ItemsService } from "./items";
import { Monster, MonstersModule, MonstersService } from "./monsters";
import { TypeOrmModule } from "@nestjs/typeorm";
import { YamlConfigModule } from "../config/yaml-config";
import { RegionConfig, RewardConfig } from "./config";
import { Region, RegionsModule, RegionsService } from "./regions";
import { RandomBoxesModule, RandomBoxesService, RandomCoinService, RandomItemService } from "./random-boxes";

@Module({
    imports: [
        TypeOrmModule.forFeature([Skill, Item, Monster, Region]),
        YamlConfigModule.forFeature([RegionConfig, RewardConfig]),
        SkillsModule,
        ItemsModule,
        MonstersModule,
        RegionsModule,
        RandomBoxesModule
    ],
    providers: [
        SkillsService,
        ItemsService,
        MonstersService,
        RegionsService,
        RandomBoxesService,
        RandomItemService,
        RandomCoinService
    ],
    exports: [
        SkillsService,
        ItemsService,
        MonstersService,
        RegionsService,
        RandomBoxesService,
        RandomItemService,
        RandomCoinService
    ]
})
export class GameModule {}