import { Inject, Injectable, Logger } from "@nestjs/common";
import { Battle } from "../../schema";
import { BattleConfig } from "../../../game";
import { BattleExecution } from "./battle.execution";
import { BattleMessage } from "../../dto";
import { EventBus } from "@nestjs/cqrs";
import { BattleEndedEvent } from "../../event";
import { pick } from "@fxts/core";

@Injectable()
export class ExecuteBattleService {
    private readonly _logger: Logger = new Logger(ExecuteBattleService.name);
    private readonly _expires: number;

    constructor(
       @Inject(EventBus)
       private readonly _eventBus: EventBus,
       @Inject(BattleConfig)
       { expires }: BattleConfig
    ) {
        this._expires = expires;
    }

    *executeBattle(battle: Battle): Iterable<BattleMessage> {
        const execution = BattleExecution.createExecution(battle);
        const startAt = Date.now();

        for (const turnResult of execution.executeTurn()) {
            this._logger.log(turnResult);
            if (Date.now() - startAt >= this._expires ) break;
            yield { type: "RUN", payload: turnResult };
        }

        const result = {
            win: execution.finished,
            startAt: new Date(startAt),
            endAt: new Date(),
        };

        yield { type: "END", payload: result };

        this._eventBus.publish(new BattleEndedEvent({
            ...pick(["id", "userId", "reward", "penalty"], battle),
            result
        }));
    }

}

