import { Body, Controller, Get, HttpCode, Inject, Put, Sse, UseGuards } from "@nestjs/common";
import { UserSkillsService } from "../service";
import { SkillsService } from "../../game";
import { JwtAuthGuard } from "../../auth";
import { SseQuerySchema, User } from "../../common";
import { GetUserSkillsResponse, SkillsAddedNotification, UpdateSkillsSlotBody } from "../dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation, ApiQuery,
    ApiResetContentResponse,
    ApiTags,
    ApiUnprocessableEntityResponse
} from "@nestjs/swagger";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { from, fromEvent, map, mergeMap, Observable } from "rxjs";
import { UserSkillsUnlockedEvent } from "../../states/event";

@ApiTags("Inventory", "Skills")
@Controller("/api/inventory/skills")
@UseGuards(JwtAuthGuard)
export class UserSkillsController {

    constructor(
       @Inject(SkillsService)
       private readonly _skillsService: SkillsService,
       @Inject(UserSkillsService)
       private _userSkillsService: UserSkillsService,
       @Inject(EventEmitter2)
       private readonly _eventEmitter: EventEmitter2
    ) {}

    @Get("/")
    @ApiOperation({ summary: "전체 스킬 & 사용 가능한 스킬 조회" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: GetUserSkillsResponse })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    async getUserSkills(@User("id") userId: number): Promise<GetUserSkillsResponse> {
        const skills = await this._skillsService.getAllSkills();
        const userSkills = await this._userSkillsService.getUserSkills(userId);
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

    @Sse("/notification")
    @ApiOperation({ summary: "스킬 해금 알림" })
    @ApiQuery({ type: SseQuerySchema, required: true })
    @ApiOkResponse({ type: SkillsAddedNotification })
    notifySkillsAdded(@User("id" ) userId: number): Observable<SkillsAddedNotification> {
        return fromEvent(this._eventEmitter, `user.${userId}.skills.unlocked`)
            .pipe(
                map(msg => msg as UserSkillsUnlockedEvent),
                mergeMap(({ skillIds }) =>
                    from(this._userSkillsService.addUserSkills({ userId, skillIds }))
                ),
                map(newSkills => ({ newSkills }))
            );
    }
}