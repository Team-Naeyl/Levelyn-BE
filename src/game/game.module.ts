import { Module } from "@nestjs/common";
import { SkillsModule, SkillsService } from "./skills";
import { ItemsModule, ItemsService } from "./items";
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
        MonstersService
    ],
    exports: [
        SkillsService,
        ItemsService,
        MonstersService
    ]
})
export class GameModule {}