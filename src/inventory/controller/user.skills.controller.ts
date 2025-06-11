import { Body, Controller, Get, HttpCode, Inject, Put, UseGuards } from "@nestjs/common";
import { UserSkillsService } from "../service";
import { SkillsService } from "../../skills";
import { JwtAuthGuard } from "../../auth/jwt.auth.guard";
import { User } from "../../common";
import { GetUserSkillsResponse, UpdateSkillsSlotBody } from "../dto";

@Controller("/api/inventory/skills")
@UseGuards(JwtAuthGuard)
export class UserSkillsController {

    constructor(
       @Inject(SkillsService)
       private readonly _skillsService: SkillsService,
       @Inject(UserSkillsService)
       private _userSkillsService: UserSkillsService
    ) {}

    @Get("/")
    async getUserSkills(@User("id") userId: number): Promise<GetUserSkillsResponse> {
        const skills = await this._skillsService.getAllSkills();
        const userSkills = await this._userSkillsService.getUserSkills(userId);
        return { skills, userSkills };
    }

    @Put("/slot")
    @HttpCode(205)
    async updateSlot(
        @User("id") userId: number,
        @Body() { skillIds }: UpdateSkillsSlotBody
    ): Promise<void> {
        await this._userSkillsService.updateEquipped({ userId, skillIds });
    }
}