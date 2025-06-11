import { Body, Controller, Get, HttpCode, Inject, Patch, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth";
import { UserItemsService } from "../service";
import { User } from "../../common";
import { UpdateItemsSlotBody, GetUserItemsResponse } from "../dto";

@Controller("/api/inventory/items")
@UseGuards(JwtAuthGuard)
export class UserItemsController {

    constructor(
       @Inject(UserItemsService)
       private readonly _userItemsService: UserItemsService
    ) {}

    @Get("/")
    async getUserItems(@User("id") userId: number): Promise<GetUserItemsResponse> {
        const results = await this._userItemsService.getUserItems(userId);
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