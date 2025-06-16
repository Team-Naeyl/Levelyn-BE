import { Body, Controller, Delete, Get, HttpCode, Inject, Patch, Post, UseGuards } from "@nestjs/common";
import { GoalsService } from "../service";
import { JwtAuthGuard } from "../../auth";
import { User } from "../../common";
import { CreateGoalBody, UpdateGoalBody } from "../dto";

@Controller("/api/goals")
@UseGuards(JwtAuthGuard)
export class GoalsController {

    constructor(
        @Inject(GoalsService)
        private readonly _goalsService: GoalsService
    ) {}

    @Post("/")
    async createGoal(
        @User("id") userId: number,
        @Body() body: CreateGoalBody
    ) {
        await this._goalsService.createGoal({ userId, ...body });
    }

    @Get("/")
    async getCurrentGoal(@User("id") userId: number) {
        const result = await this._goalsService.getCurrentGaol(userId);
        return  { result };
    }

    @Patch("/")
    @HttpCode(205)
    async updateGoal(
        @User("id") userId: number,
        @Body() body: UpdateGoalBody
    ) {
        await this._goalsService.updateGoal({ userId, ...body });
    }

    @Delete("/")
    @HttpCode(204)
    async deleteGoal(@User("id") userId: number) {
        await this._goalsService.deleteGoal(userId);
    }
}