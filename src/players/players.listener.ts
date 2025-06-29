import { Inject, Injectable, Logger } from "@nestjs/common";
import { PlayersService } from "./service";
import { OnEvent } from "@nestjs/event-emitter";
import { TileRewardEvent } from "../tiles/dto";

@Injectable()
export class PlayersListener {
    private readonly _logger: Logger = new Logger(PlayersService.name);

    constructor(
        @Inject(PlayersService)
        private readonly _playersService: PlayersService
    ) {}

    @OnEvent("tile.reward")
    async onTileReward(msg: TileRewardEvent): Promise<void> {
        const { userId: id, exp: deltaExp } = msg;

        await this._playersService.updatePlayer({ id, deltaExp, deltaPosition: 1 })
            .catch(err => this._logger.error(err));
    }
}