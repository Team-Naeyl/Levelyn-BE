import { Inject, Injectable } from '@nestjs/common';
import {  TileConfig } from "../game";
import { pipe } from "@fxts/core";
import { Random } from "random";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ClearTileResult } from "./dto";
import { UserRewardedEvent } from "../rewards/event";
import { RewardsService } from "../rewards";
import { TileBattleEvent } from "./event";

@Injectable()
export class TilesService {
    private readonly isBattleEvent: () => boolean;

    constructor(
        @Inject(RewardsService)
        private readonly _rewardsService: RewardsService,
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2,
        @Inject(Random)
        random: Random,
        @Inject(TileConfig)
        { pBattleEvent }: TileConfig
    ) {
        this.isBattleEvent = pipe(
            random.binomial(1, pBattleEvent),
            dist => () => Boolean(dist())
        );
    }

    async clearTile(userId: number): Promise<ClearTileResult> {
        const isBattle = this.isBattleEvent();

        if (isBattle) {
            this._eventEmitter.emit(
                "tile.battle",
                new TileBattleEvent(userId)
            );
        }
        else {
            const reward = await this._rewardsService.makeReward({ exp: 0, coin: 0 });

            this._eventEmitter.emit("tile.reward", new UserRewardedEvent({
                userId, ...reward,
            }));
        }

        return { isBattle };
    }


}
