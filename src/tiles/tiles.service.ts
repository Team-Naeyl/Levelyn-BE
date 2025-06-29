import { Inject, Injectable, Logger } from '@nestjs/common';
import { IS_BATTLE_EVENT, TILE_EXP_REWARD } from "./token";
import { GachaService } from "../gacha";
import { TileRewardEvent, TileRewardDTO } from "./dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { omit } from "@fxts/core";

@Injectable()
export class TilesService {
    private readonly _logger: Logger = new Logger(TilesService.name);

    constructor(
       @Inject(TILE_EXP_REWARD)
       private readonly _expReward: number,
       @Inject(IS_BATTLE_EVENT)
       private readonly isBattleEvent: () => boolean,
       @Inject(GachaService)
       private readonly _gachaService: GachaService,
       @Inject(EventEmitter2)
       private readonly _eventEmitter: EventEmitter2
    ) {}

    async makeTileReward(userId: number): Promise<TileRewardDTO> {

        const event: TileRewardEvent = {
            userId,
            exp: this._expReward,
            itemId: null,
            coin: null,
            isBattle: this.isBattleEvent()
        };

        event.isBattle || Object.assign(event, await this._gachaService.runGacha());
        this._eventEmitter.emit("tile.reward", event);
        return omit(["userId"], event);
    }


}
