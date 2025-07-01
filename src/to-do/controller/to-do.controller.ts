import { Body, Controller, Delete, Get, HttpCode, Inject, Logger, Param, Patch, Post, Put, Query,  UseGuards } from "@nestjs/common";
import { ToDoService } from "../service";
import { JwtAuthGuard } from "../../auth";
import { User } from "../../common";
import { CreateToDoBody, GetDailyToDoListQuery, UpdateToDoBody } from "../dto";
import { UserInfo } from "../../auth/dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiConflictResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiQuery, ApiResetContentResponse,
    ApiResponse,
    ApiTags,
    ApiUnprocessableEntityResponse
} from "@nestjs/swagger";

@ApiTags("ToDo")
@Controller("/api/to-do")
@UseGuards(JwtAuthGuard)
export class ToDoController {
    private readonly _logger: Logger = new Logger(ToDoController.name);

    constructor(
        @Inject(ToDoService)
        private readonly _toDoService: ToDoService,
    ) {}

    @Post("/")
    @ApiOperation({ summary: "할 일 생성" })
    @ApiBearerAuth()
    @ApiBody({ type: CreateToDoBody, required: true })
    @ApiResponse({ status: 201, description: "성공" })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 body" })
    @ApiNotFoundResponse({ description: "주요 목표가 설정되지 않은 상태에서 하위 할 일을 연동하려고 함" })
    @ApiConflictResponse({ description: "연동하려는 하위 할 일의 날짜가 주요 목표의 시작일과 종료일 사이에 있지 않음" })
    async createToDo(
        @User("id") userId: number,
        @Body() body: CreateToDoBody
    ) {
        await this._toDoService.createToDo({ userId, ...body });
    }

    @Get("/")
    @ApiOperation({ summary: "날짜별 할 일 조회" })
    @ApiBearerAuth()
    @ApiQuery({ type: GetDailyToDoListQuery, required: true })
    @ApiOkResponse()
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 쿼리 파리미터" })
    async getDailyToDoList(
        @User("id") userId: number,
        @Query() query: GetDailyToDoListQuery
    ) {
       const results = await this._toDoService.getDailyToDoList({ userId, ...query });
       return { results };
    }

    @Patch("/:id")
    @ApiOperation({ summary: "할 일 수정" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true , description: "수정할 할 일의 id"})
    @ApiBody({ type: UpdateToDoBody, required: true })
    @ApiResponse({ status: 205, description: "성공" })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    @ApiNotFoundResponse({ description: "존재하지 않는 할 일 또는 주요 목표가 설정되지 않은 상태에서 하위 할 일을 연동하려고 함" })
    @ApiConflictResponse({ description: "연동하려는 하위 할 일의 날짜가 주요 목표의 시작일과 종료일 사이에 있지 않음" })
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 body" })
    @HttpCode(205)
    async updateToDo(
        @Param("id") id: number,
        @User("id") userId: number,
        @Body() body: UpdateToDoBody
    ) {
        await this._toDoService.updateToDo({ id, userId, ...body });
    }

    @Delete("/:id")
    @ApiOperation({ summary: "할 일 삭제" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true , description: "삭제할 할 일의 id"})
    @ApiResponse({ status: 204, description: "성공" })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    @ApiNotFoundResponse({ description: "존재하지 않는 할 일" })
    @HttpCode(204)
    async deleteToDo(
        @Param("id") id: number,
        @User("id") userId: number
    ) {
        await this._toDoService.deleteToDo({ id, userId });
    }

    @Put("/:id")
    @ApiOperation({ summary: "할 일 완료" })
    @ApiBearerAuth()
    @ApiParam({ name: "id", type: "integer", required: true , description: "완료한 할 일의 id"})
    @ApiResetContentResponse()
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    @ApiNotFoundResponse({ description: "존재하지 않는 할 일" })
    @ApiConflictResponse({ description: "기한이 지난 할 일" })
    async fulfillToDo(
        @Param("id") id: number,
        @User() user: UserInfo
    ) {
        await this._toDoService.fulfilToDo({ id, userId: user.id });
    }
}