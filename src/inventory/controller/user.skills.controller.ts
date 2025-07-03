import { Body, Controller, Get, HttpCode, Inject, Logger, Put, Sse, UseGuards } from "@nestjs/common";
import { UserSkillsService } from "../service";
import { SkillsService } from "../../game";
import { JwtAuthGuard } from "../../auth";
import { User } from "../../common";
import { GetUserSkillsResponse, UpdateSkillsSlotBody } from "../dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResetContentResponse,
    ApiTags,
    ApiUnprocessableEntityResponse
} from "@nestjs/swagger";

@ApiTags("Inventory", "Skills")
@Controller("/api/inventory/skills")
@UseGuards(JwtAuthGuard)
export class UserSkillsController {
    private readonly _logger: Logger = new Logger(UserSkillsController.name);

    constructor(
       @Inject(SkillsService)
       private readonly _skillsService: SkillsService,
       @Inject(UserSkillsService)
       private _userSkillsService: UserSkillsService,
    ) {}

    @Get("/")
    @ApiOperation({ summary: "전체 스킬 & 사용 가능한 스킬 조회" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: GetUserSkillsResponse })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    async getUserSkills(@User("id") userId: number): Promise<GetUserSkillsResponse> {
        const skills = await this._skillsService.getAllSkills();
        const userSkills = await this._userSkillsService.getUserSkills({ userId });
        return { skills, userSkills };
    }

    @Put("/slot")
    @ApiOperation({ summary: "스킬 슬롯 변경", description: "스킬 슬롯을 요청한 값들로 덮어쓴다" })
    @ApiBearerAuth()
    @ApiBody({ type: UpdateSkillsSlotBody, required: true })
    @ApiResetContentResponse()
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 body" })
    @HttpCode(205)
    async updateSlot(
        @User("id") userId: number,
        @Body() { skillIds }: UpdateSkillsSlotBody
    ): Promise<void> {
        await this._userSkillsService.updateEquipped({ userId, skillIds });
    }


}