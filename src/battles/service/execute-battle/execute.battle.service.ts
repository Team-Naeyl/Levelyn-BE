import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { BattleConfig } from "../../../game";
import { BattleExecution } from "./battle.execution";
import { ExecuteBattleResult } from "../../dto";
import { EventBus } from "@nestjs/cqrs";
import { BattleEndedEvent } from "../../event";
import { BattlesRepository } from "../../battles.repository";
import { isNull, pipe, throwIf } from "@fxts/core";

@Injectable()
export class ExecuteBattleService {
    private readonly _logger: Logger = new Logger(ExecuteBattleService.name);
    private readonly _expires: number;

    constructor(
       @Inject(BattlesRepository)
       private readonly _battlesRepos: BattlesRepository,
       @Inject(EventBus)
       private readonly _eventBus: EventBus,
       @Inject(BattleConfig)
       { expires }: BattleConfig
    ) {
        this._expires = expires;
    }

    async *executeBattle(id: string): AsyncIterableIterator<ExecuteBattleResult> {

        const battle = pipe(
            await this._battlesRepos.findBattleById(id),
            throwIf(isNull, () => new NotFoundException())
        );

        const execution = BattleExecution.createExecution(battle);
        const startAt = Date.now();

        for (const turnResult of execution.executeTurn()) {
            this._logger.log(turnResult);
            if (Date.now() - startAt >= this._expires ) break;
            yield { status: "RUNNING", payload: turnResult };
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const result = {
            win: execution.finished,
            startAt: new Date(startAt),
            endAt: new Date(),
        };

        yield { status: "DONE", payload: result };

        this._eventBus.publish(
            new BattleEndedEvent({
                userId: battle.userId,
                reward: result.win ? battle.reward : null,
                penalty: result.win ? null : battle.penalty,
            })
        );
    }

}

