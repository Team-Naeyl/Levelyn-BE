import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { TileBattleEvent } from "../tiles/event";

@Injectable()
export class BattlesListener {
    private readonly _logger: Logger = new Logger(BattlesListener.name);

    @OnEvent("tile.battle")
    async onTileBattle(msg: TileBattleEvent): Promise<void> {
        this._logger.log(JSON.stringify(msg));
    }
}