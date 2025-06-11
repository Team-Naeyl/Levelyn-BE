import { Body, Controller, Get, Inject, Logger, Post, UseGuards } from "@nestjs/common";
import { ToDoService } from "./to-do.service";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";
import { User } from "../common";
import { CreateToDoBody } from "./dto";

@Controller("/api/to-do")
@UseGuards(JwtAuthGuard)
export class ToDoController {
    private readonly _logger: Logger = new Logger(ToDoController.name);

    constructor(
        @Inject(ToDoService)
        private readonly _toDoService: ToDoService
    ) {}

    @Post()
    async createToDo(
        @User("id") userId: number,
        @Body() body: CreateToDoBody
    ) {
        const { period: [since, until], ...rest } = body;
        await this._toDoService.createToDo({ userId, since, until, ...rest });
    }

    @Get("/daily")
    async getDailyToDoList(@User("id") userId: number) {
        
    }
}