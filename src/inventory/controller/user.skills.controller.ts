import { Body, Controller, Get, HttpCode, Inject, Patch, UseGuards } from "@nestjs/common";
import { UserSkillsService } from "../service";
import { SkillsService } from "../../skills";
import { JwtAuthGuard } from "../../auth/jwt.auth.guard";
import { User } from "../../common";
import { map, pipe, toArray } from "@fxts/core";
import { GetUserSkillsResponse, UpdateSkillsSlotBody, UserSkillDTO, UserSkillSchema } from "../dto";

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

        const userSkills = pipe(
            await this._userSkillsService.getUserSkills(userId),
            map(({ equipped, skill }: UserSkillDTO): UserSkillSchema => ({
              equipped, ...skill
            })),
            toArray
        );

        return { skills, userSkills };
    }

    @Patch("/slot")
    @HttpCode(205)
    async updateSlot(
        @User("id") userId: number,
        @Body() { skillIds }: UpdateSkillsSlotBody
    ): Promise<void> {
        await this._userSkillsService.updateEquipped({ userId, skillIds });
    }
}