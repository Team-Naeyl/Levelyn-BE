import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { FulfillToDoEvent } from "../to-do/dto";
import { CreateBattleHandler } from "./handler";

@Injectable()
export class BattlesListener {
    private readonly _logger: Logger = new Logger(BattlesListener.name);

    constructor(
       @Inject(CreateBattleHandler)
       private readonly _handler: CreateBattleHandler,
    ) {}

    @OnEvent("fulfill.to-do")
    async onFulfillToDo(msg: FulfillToDoEvent): Promise<void> {
        const { userId, stateId, walletId, sessionId } = msg;

        sessionId && await this._handler
            .createBattle({ userId, stateId, sessionId })
            .catch(err => this._logger.error(err));
    }
}
