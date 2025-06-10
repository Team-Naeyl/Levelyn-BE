import { Controller, Get, Inject, Logger, Param, Patch, UseGuards } from '@nestjs/common';
import { UserItemsService } from "../inventory/service/user.items.service";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";
import { User } from "../common";

@Controller('/api/items/inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
    private readonly _logger: Logger = new Logger(InventoryController.name);

    constructor(
        @Inject(UserItemsService)
        private readonly _userItemsService: UserItemsService
    ) {}

    @Get("/")
    async getInventory(@User("id") userId: number) {
        const results = await this._userItemsService.getUserItems(userId);
        return { results };
    }

    @Patch("/:id")
    @UseGuards(JwtAuthGuard)
    async updateEquipped(
        @Param("id") id: number,
        @User("id") userId: number
    ) {
        await this._userItemsService.updateEquipped({ id, userId });
    }

}
