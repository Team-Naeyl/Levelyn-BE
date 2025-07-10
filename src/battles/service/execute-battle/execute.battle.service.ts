import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { BattleConfig } from "../../../game";
import { BattleExecutor } from "./battle.executor";
import { ExecuteBattleResult } from "../../dto";
import { EventBus } from "@nestjs/cqrs";
import { BattleEndedEvent } from "../../event";
import { BattlesRepository } from "../../battles.repository";
import { isNull, pipe, throwIf } from "@fxts/core";
import { BattleResult } from "../../schema";

@Injectable()
export class ExecuteBattleService {
    private readonly _logger: Logger = new Logger(ExecuteBattleService.name);
    private readonly _expires: number;
    private readonly _turnInterval: number;

    constructor(
       @Inject(BattlesRepository)
       private readonly _battlesRepos: BattlesRepository,
       @Inject(EventBus)
       private readonly _eventBus: EventBus,
       @Inject(BattleConfig)
       { expires, turnInterval }: BattleConfig
    ) {
        this._expires = expires;
        this._turnInterval = turnInterval;
    }

    async *executeBattle(id: string): AsyncIterableIterator<ExecuteBattleResult> {

        const battle = pipe(
            await this._battlesRepos.findBattleById(id),
            throwIf(isNull, () => new NotFoundException())
        );

        const executor = BattleExecutor.createExecutor(battle);
        const startAt = Date.now();

        for (const turnResult of executor.execute()) {
            this._logger.log(turnResult);

            if (Date.now() - startAt >= this._expires ) {
                yield { ...turnResult, done: true };
                break;
            }

            yield { ...turnResult, done: executor.finished };

            await new Promise(resolve =>
                setTimeout(resolve, this._turnInterval)
            );
        }

        const result = new BattleResult({
            mobId: battle.mob.id,
            startAt: new Date(startAt),
            endAt: new Date(),
            win: executor.finished
        });

        this._eventBus.publish(
            new BattleEndedEvent({
                userId: battle.userId,
                result: result,
                reward: result.win ? battle.reward : null,
                penalty: result.win ? null : battle.penalty,
            })
        );
    }

}

