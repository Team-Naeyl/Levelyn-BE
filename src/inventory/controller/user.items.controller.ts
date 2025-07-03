import { Body, Controller, Get, HttpCode, Inject, Logger, Patch, Sse, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth";
import { UserItemsService } from "../service";
import { User } from "../../common";
import { UpdateItemsSlotBody, GetUserItemsResponse } from "../dto";
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

@ApiTags("Inventory", "Items")
@Controller("/api/inventory/items")
@UseGuards(JwtAuthGuard)
export class UserItemsController {
    private readonly _logger: Logger = new Logger(UserItemsController.name);

    constructor(
       @Inject(UserItemsService)
       private readonly _userItemsService: UserItemsService,
    ) {}

    @Get("/")
    @ApiOperation({ summary: "소유한 아이템 조회" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: GetUserItemsResponse })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    async getUserItems(@User("id") userId: number): Promise<GetUserItemsResponse> {
        const results = await this._userItemsService.getUserItems({ userId });
        return { results };
    }

    @Patch("/slot")
    @ApiOperation({
        summary: "아이템 슬롯 변경",
        description: "요청한 아이템들의 착용 상태를 반전시킨다"
    })
    @ApiBearerAuth()
    @ApiBody({ type: UpdateItemsSlotBody, required: true })
    @ApiResetContentResponse()
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    @ApiUnprocessableEntityResponse({ description: "유효하지 않은 body" })
    @HttpCode(205)
    async updateSlot(
        @User("id") userId: number,
        @Body() { itemIds }: UpdateItemsSlotBody
    ): Promise<void> {
        await this._userItemsService.updateEquipped({ userId, itemIds });
    }
}