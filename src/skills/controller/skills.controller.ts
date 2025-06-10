import { Body, Controller, Get, Inject, Logger, Patch, UseGuards } from '@nestjs/common';
import { SkillsService } from "../service";
import { UserSkillsService } from "../service";
import { JwtAuthGuard } from "../../auth/jwt.auth.guard";
import { User } from "../../common";
import { UpdateSlotBody } from "../dto";

@Controller('/api/skills')
@UseGuards(JwtAuthGuard)
export class SkillsController {
    private readonly _logger: Logger = new Logger(SkillsService.name);

    constructor(
        @Inject(SkillsService)
        private readonly _skillsService: SkillsService,
        @Inject(UserSkillsService)
        private readonly _userSkillsService: UserSkillsService,
    ) {}

    @Get("/")
    async loadAllSkills(@User("id") userId: number) {
        const skills = await this._skillsService.getAllSkills();
        const userSkills = await this._userSkillsService.getUserSkills(userId);
        return { skills, userSkills };
    }

    @Patch("/slot")
    async updateSlot(
        @User("id") userId: number,
        @Body() { skillIds }: UpdateSlotBody
    ) {
        await this._userSkillsService
            .updateEquipped({ userId, skillIds });
    }



}
