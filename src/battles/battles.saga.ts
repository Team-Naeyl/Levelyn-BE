import { Injectable, Logger } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { map, Observable, tap } from "rxjs";
import { RewardUserCommand } from "../rewards/command";
import { BattleEndedEvent } from "./event";

@Injectable()
export class BattlesSaga {
    private readonly _logger: Logger = new Logger(BattlesSaga.name);

    @Saga()
    battleSaga(event$: Observable<any>): Observable<RewardUserCommand> {
        return event$.pipe(
            ofType(BattleEndedEvent),
            tap(msg => this._logger.log(msg)),
            map((msg: BattleEndedEvent) => {
                const { userId, reward: { exp, coin, ...buff } } = msg;
                return new RewardUserCommand({ userId, exp, coin, buff });
            })
        )
    }

}