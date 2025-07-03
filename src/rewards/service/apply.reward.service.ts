import { Inject, Injectable, Logger } from "@nestjs/common";
import { RewardDTO } from "../dto";
import { CommandBus } from "@nestjs/cqrs";
import { UpdateStateCommand } from "../../states/command";
import { AddUserItemsCommand } from "../../inventory/command";
import { UpdateWalletCommand } from "../../wallets/command";

@Injectable()
export class ApplyRewardService {
    private readonly _logger: Logger = new Logger(ApplyRewardService.name);

    constructor(
       @Inject(CommandBus)
       private readonly _commandBus: CommandBus,
    ) {}

    async applyReward(
        userId: number,
        reward: RewardDTO
    ) {
        this._logger.log({ userId, reward });
        const { exp, itemId, coin } = reward;
        await this.applyExpReward(userId, exp);
        itemId && await this.applyItemReward(userId, itemId);
        coin && await this.applyCoinReward(userId, coin);
    }

    private async applyExpReward(userId: number, exp: number) {
        await this._commandBus.execute(
            new UpdateStateCommand({
                id: userId,
                deltaExp: exp,
                deltaPosition: 1
            })
        );
    }

    private async applyItemReward(userId: number, itemId: number) {
        await this._commandBus.execute(
            new AddUserItemsCommand({
                userId,
                itemIds: [itemId]
            })
        );
    }

    private async applyCoinReward(userId: number, coin: number) {
        await this._commandBus.execute(
            new UpdateWalletCommand({
                id: userId,
                deltaCoin: coin
            })
        );
    }
}