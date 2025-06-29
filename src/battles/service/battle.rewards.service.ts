import { Inject, Injectable } from "@nestjs/common";
import { GachaService } from "../../gacha";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { BATTLE_EXP_REWARD } from "../token";
import { BattleRewardDTO, BattleRewardEvent } from "../dto";
import { omit } from "@fxts/core";

@Injectable()
export class BattleRewardsService {

    constructor(
        @Inject(BATTLE_EXP_REWARD)
        private readonly _expReward: number,
        @Inject(GachaService)
        private readonly _gachaService: GachaService,
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2
    ) {}

    async makeBattleReward(userId: number): Promise<BattleRewardDTO> {

        const event: BattleRewardEvent = {
            userId,
            exp: this._expReward,
            ...await this._gachaService.runGacha()
        };

        this._eventEmitter.emit("battle.reward", event);
        return omit(["userId"], event);
    }
}