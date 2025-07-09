import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Battle } from "../../schema";
import { BattleConfig } from "../../../game";
import { BattleExecution } from "./battle.execution";
import { ExecuteBattleResult } from "../../dto";
import { EventBus } from "@nestjs/cqrs";
import { BattleEndedEvent } from "../../event";
import { isNil, pipe, tap, throwIf } from "@fxts/core";
import Redis from "ioredis";

@Injectable()
export class ExecuteBattleService {
    private readonly _logger: Logger = new Logger(ExecuteBattleService.name);
    private readonly _expires: number;

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis,
       @Inject(EventBus)
       private readonly _eventBus: EventBus,
       @Inject(BattleConfig)
       { expires }: BattleConfig
    ) {
        this._expires = expires;
    }

    async *executeBattle(id: string): AsyncIterableIterator<ExecuteBattleResult> {
        const battle = await this.loadBattle(id);
        const execution = BattleExecution.createExecution(battle);
        const startAt = Date.now();

        for (const turnResult of execution.executeTurn()) {
            this._logger.log(turnResult);
            if (Date.now() - startAt >= this._expires ) break;
            yield { status: "RUNNING", payload: turnResult };
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

        await this._redis.del(battle.id);
    }

    private async loadBattle(id: string): Promise<Battle> {
        return pipe(
            await this._redis.call("JSON.GET", id, "$"),
            tap(raw => this._logger.log(raw)),
            throwIf(isNil, () => new NotFoundException()),
            raw => JSON.parse(raw as string) as Battle,
        );
    }
}

