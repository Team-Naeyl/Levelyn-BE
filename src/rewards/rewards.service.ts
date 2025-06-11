import { Inject, Injectable } from '@nestjs/common';
import { ItemsService, UserItemsService } from "../items";
import { ItemDTO } from "../items/dto";
import random from "random";

@Injectable()
export class RewardsService {

    constructor(
        @Inject(ItemsService)
        private readonly _itemsService: ItemsService,
        @Inject(UserItemsService)
        private readonly _inventoryService: UserItemsService
    ) {}

    async rewardItem(userId: number) {
        const items = await this._itemsService.getAllItems();

        let reward: ItemDTO | undefined;
        while (!reward) reward = random.choice(items);

        await this._inventoryService.addUserItems({ itemId: reward.id, userId });
    }

}
