import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Skill } from "./skill.model";
import { SkillsController } from './controller';
import { SkillsService } from "./service";

@Module({
    imports: [TypeOrmModule.forFeature([Skill])],
    controllers: [SkillsController],
    providers: [SkillsService],
    exports: [SkillsService]
})
export class SkillsModule {}
