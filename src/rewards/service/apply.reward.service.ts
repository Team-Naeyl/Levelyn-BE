import { Inject, Injectable, Logger } from "@nestjs/common";
import { ApplyRewardDTO, ApplyRewardResult } from "../dto";
import { CommandBus } from "@nestjs/cqrs";
import { UpdateStateCommand } from "../../states/update.state.command";
import { AddUserItemsCommand } from "../../inventory/command";
import { UpdateWalletCommand } from "../../wallets/command";
import { UserItemDTO } from "../../inventory/dto";

@Injectable()
export class ApplyRewardService {
    private readonly _logger: Logger = new Logger(ApplyRewardService.name);

    constructor(
       @Inject(CommandBus)
       private readonly _commandBus: CommandBus,
    ) {}

    async applyReward(dto: ApplyRewardDTO): Promise<ApplyRewardResult> {
        this._logger.log(dto);
        const { userId, reward: { exp, itemId, coin } } = dto;

        await this.applyExpReward(userId, exp);
        coin && await this.applyCoinReward(userId, coin);

        const items = itemId
            ? await this.applyItemReward(userId, itemId) : [];

        return { exp, items, coin };
    }

    private async applyExpReward(userId: number, exp: number): Promise<void> {
        await this._commandBus.execute(
            new UpdateStateCommand({ id: userId, deltaExp: exp })
        );
    }

    private async applyItemReward(userId: number, itemId: number): Promise<UserItemDTO[]> {
        return await this._commandBus.execute(
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