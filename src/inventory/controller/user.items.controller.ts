import { Body, Controller, Get, HttpCode, Inject, Patch, Sse, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth";
import { UserItemsService } from "../service";
import { SseQuerySchema, User } from "../../common";
import { UpdateItemsSlotBody, GetUserItemsResponse, ItemsAddedNotification } from "../dto";
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
import { fromEvent, map, Observable, mergeMap, from } from "rxjs";
import { UserRewardedEvent } from "../../rewards/event";

@ApiTags("Inventory", "Items")
@Controller("/api/inventory/items")
@UseGuards(JwtAuthGuard)
export class UserItemsController {

    constructor(
       @Inject(UserItemsService)
       private readonly _userItemsService: UserItemsService,
       @Inject(EventEmitter2)
       private readonly _eventEmitter: EventEmitter2
    ) {}

    @Get("/")
    @ApiOperation({ summary: "소유한 아이템 조회" })
    @ApiBearerAuth()
    @ApiOkResponse({ type: GetUserItemsResponse })
    @ApiForbiddenResponse({ description: "토큰 인증 실패" })
    async getUserItems(@User("id") userId: number): Promise<GetUserItemsResponse> {
        const results = await this._userItemsService.getUserItems(userId);
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
    @Sse("/notification")
    @ApiOperation({ summary: "새로운 아이템이 인벤토리에 추가됨" })
    @ApiQuery({ type: SseQuerySchema, required: true })
    @ApiOkResponse({ type: ItemsAddedNotification })
    notifyItemsAdded(@User("id" ) userId: number): Observable<ItemsAddedNotification> {
        return fromEvent(this._eventEmitter, `user.${userId}.rewarded`)
            .pipe(
                map(msg => msg as UserRewardedEvent),
                mergeMap(({ itemIds }) =>
                    from(this._userItemsService.addUserItems({ userId, itemIds }))
                ),
                map(newItems => ({ newItems }))
            );
    }
}