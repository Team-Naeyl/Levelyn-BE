import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserItemsService } from "../../../inventory";
import { BattlePenalty, BattleReward, PlayerStat } from "../../schema";
import { ItemEffectDTO } from "../../../game/items/dto";
import { pipe, tap } from "@fxts/core";

@Injectable()
export class ApplyItemsService {
    private _logger: Logger = new Logger(ApplyItemsService.name);

    constructor(
       @Inject(UserItemsService)
       private readonly _userItemsService: UserItemsService,
    ) {}

    async applyEquippedItems(
        userId: number,
        stat: PlayerStat,
        reward: BattleReward,
        penalty: BattlePenalty
    ): Promise<void> {

        const effect = pipe(
            await this._userItemsService.getNetEquippedItemEffect(userId),
            tap(effect => this._logger.debug(effect))
        );

        this.applyEffect(stat, effect);
        this.applyEffect(reward, effect);
        this.applyEffect(penalty, effect);

        this._logger.debug({ stat, reward, penalty });
    }

    private applyEffect(tg: Partial<ItemEffectDTO>, effect: ItemEffectDTO): void {
        for (const k of Object.keys(tg))
            tg[k] += effect[k];
    }

}