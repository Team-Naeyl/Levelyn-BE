import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Skill } from "./skill.model";
import { SkillsService } from "./service";

@Module({
    imports: [TypeOrmModule.forFeature([Skill])],
    providers: [SkillsService],
    exports: [SkillsService]
})
export class SkillsModule {}
