import { Module } from "@nestjs/common";
import { SkillsModule, SkillsService } from "./skills";
import { ItemRangesService, ItemsModule, ItemsService, RandomItemService } from "./items";
import { MonstersModule, MonstersService } from "./monsters";

@Module({
    imports: [
        SkillsModule,
        ItemsModule,
        MonstersModule
    ],
    providers: [
        SkillsService,
        ItemsService,
        ItemRangesService,
        RandomItemService,
        MonstersService
    ],
    exports: [
        SkillsService,
        ItemsService,
        ItemRangesService,
        RandomItemService,
        MonstersService
    ]
})
export class GameModule {}