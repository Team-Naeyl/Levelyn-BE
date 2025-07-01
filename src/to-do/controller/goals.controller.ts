import { Body, Controller, Delete, Get, HttpCode, Inject, Patch, Post, UseGuards } from "@nestjs/common";
import { GoalsService } from "../service";
import { JwtAuthGuard } from "../../auth";
import { User } from "../../common";
import { CreateGoalBody, GetCurrentGoalResponse, UpdateGoalBody } from "../dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResetContentResponse, ApiTags,
    ApiUnprocessableEntityResponse
} from "@nestjs/swagger";

@ApiTags("Goals")
@Controller("/api/goals")
@UseGuards(JwtAuthGuard)
export class GoalsController {

    constructor(
        @Inject(GoalsService)
        private readonly _goalsService: GoalsService
    ) {}

    @Post("/")
    @ApiOperation({ summary: "목표 생성" })
    @ApiBearerAuth()
    @ApiBody({ type: CreateGoalBody, required: true })
    @ApiCreatedResponse({ description: "성공" })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 body" })
    async createGoal(
        @User("id") userId: number,
        @Body() body: CreateGoalBody
    ) {
        await this._goalsService.createGoal({ userId, ...body });
    }

    @Get("/")
    @ApiOperation({ summary: "목표 조회" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: GetCurrentGoalResponse, description: "성공" })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    async getCurrentGoal(@User("id") userId: number): Promise<GetCurrentGoalResponse> {
        const result = await this._goalsService.getCurrentGaol(userId);
        return  { result };
    }

    @Patch("/")
    @ApiOperation({ summary: "목표 수정" })
    @ApiBearerAuth()
    @ApiBody({ type: UpdateGoalBody, required: true })
    @ApiResetContentResponse({ description: "성공" })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 body" })
    @HttpCode(205)
    async updateGoal(
        @User("id") userId: number,
        @Body() body: UpdateGoalBody
    ) {
        await this._goalsService.updateGoal({ userId, ...body });
    }

    @Delete("/")
    @ApiOperation({ summary: "목표 삭제" })
    @ApiBearerAuth()
    @ApiNoContentResponse({ description: "성공" })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    @HttpCode(204)
    async deleteGoal(@User("id") userId: number) {
        await this._goalsService.deleteGoal(userId);
    }
}