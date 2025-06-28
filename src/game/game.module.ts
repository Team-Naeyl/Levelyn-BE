import { Module } from "@nestjs/common";
import { Skill, SkillsModule, SkillsService } from "./skills";
import { Item, ItemsModule, ItemsService } from "./items";
import { Monster, MonstersModule, MonstersService } from "./monsters";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([Skill, Item, Monster]),
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