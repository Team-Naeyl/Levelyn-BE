import { Body, Controller, Get, HttpCode, Inject, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt.auth.guard";
import { UserItemsService } from "../service";
import { User } from "../../common";
import { UpdateItemsSlotBody, UserItemSchema, GetUserItemsResponse, UserItemDTO } from "../dto";
import { map, pipe, toArray } from "@fxts/core";

@Controller("/api/inventory/items")
@UseGuards(JwtAuthGuard)
export class UserItemsController {

    constructor(
       @Inject(UserItemsService)
       private readonly _userItemsService: UserItemsService
    ) {}

    @Get("/")
    async getUserItems(@User("id") userId: number): Promise<GetUserItemsResponse> {

        const results = pipe(
            await this._userItemsService.getUserItems(userId),
            map(({ equipped, item }: UserItemDTO): UserItemSchema => {
                return { equipped, ...item };
            }),
            toArray
        );

        return { results };
    }

    @Patch("/slot")
    @HttpCode(205)
    async updateSlot(
        @User("id") userId: number,
        @Body() { itemIds }: UpdateItemsSlotBody
    ): Promise<void> {
        await this._userItemsService.updateEquipped({ userId, itemIds });
    }
}