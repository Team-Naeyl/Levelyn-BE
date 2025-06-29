import { Inject, Injectable, Logger } from "@nestjs/common";
import { TileRewardEvent } from "../tiles/dto";
import { BattlesService } from "./service";

@Injectable()
export class BattlesListener {
    private readonly _logger: Logger = new Logger(BattlesListener.name);

    constructor(
        @Inject(BattlesService)
        private readonly _battlesService: BattlesService
    ) {}

    async onTileReward(msg: TileRewardEvent): Promise<void> {
        const { userId, isBattle } = msg;

        isBattle && await this._battlesService.createBattle(userId)
            .catch(err => this._logger.error(err));
    }
}