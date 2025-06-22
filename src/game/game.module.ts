import { Module } from "@nestjs/common";
import { SkillsModule, SkillsService } from "./skills";
import { ItemRangesService, ItemsModule, ItemsService, RandomItemService } from "./items";
import { MonstersModule, MonstersService } from "./monsters";
import { RandomBoxesService, RewardsModule, RewardsService } from "./rewards";

@Module({
    imports: [
        SkillsModule,
        ItemsModule,
        MonstersModule,
        RewardsModule
    ],
    providers: [
        SkillsService,
        ItemsService,
        ItemRangesService,
        RandomItemService,
        MonstersService,
        RewardsService,
        RandomBoxesService
    ],
    exports: [
        SkillsService,
        ItemsService,
        ItemRangesService,
        RandomItemService,
        MonstersService,
        RewardsService,
        RandomBoxesService
    ]
})
export class GameModule {}