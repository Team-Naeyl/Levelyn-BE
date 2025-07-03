import { Body, Controller, Get, HttpCode, Inject, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from "../auth";
import { MyPagesService } from "./my-pages.service";
import { User } from "../common";
import { MyPageSchema, UpdateProfileBody } from "./dto";
import {
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiOperation, ApiResetContentResponse,
    ApiTags,
    ApiUnprocessableEntityResponse
} from "@nestjs/swagger";

@ApiTags("MyPages")
@Controller('/api/my-pages')
@UseGuards(JwtAuthGuard)
export class MyPagesController {

    constructor(
       @Inject(MyPagesService)
       private readonly _myPagesService: MyPagesService
    ) {}

    @Get("/")
    @ApiOperation({ summary: "마이페이지 조회"})
    @ApiBearerAuth()
    @ApiOkResponse({ type: MyPageSchema })
    @ApiForbiddenResponse()
    async getMyPage(@User("id") userId: number): Promise<MyPageSchema> {
        return await this._myPagesService.getMyPage(userId);
    }

    @Patch("/")
    @ApiOperation({ summary: "프로필 수정"})
    @ApiBearerAuth()
    @ApiBody({ type: UpdateProfileBody, required: true })
    @ApiResetContentResponse()
    @ApiForbiddenResponse()
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 바디" })
    @HttpCode(205)
    async updateProfile(
        @User("id") userId: number,
        @Body() body: UpdateProfileBody
    ): Promise<void> {

    }
}
