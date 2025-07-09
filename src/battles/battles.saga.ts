import { Injectable, Logger } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { map, Observable, tap } from "rxjs";
import { RewardUserCommand } from "../rewards/reward.user.command";
import { BattleEndedEvent } from "./event";
import { SetPenaltyCommand } from "../tiles/set.penalty.command";

@Injectable()
export class BattlesSaga {
    private readonly _logger: Logger = new Logger(BattlesSaga.name);

    @Saga()
    battleSaga(event$: Observable<any>): Observable<RewardUserCommand | SetPenaltyCommand> {
        return event$.pipe(
            ofType(BattleEndedEvent),
            tap(msg => this._logger.log(msg)),
            map((msg: BattleEndedEvent) => {
                const { userId, reward, penalty } = msg;

                if (reward) {
                    const { exp, coin, pItem, pCoin  } = reward;

                    return new RewardUserCommand({
                        userId, exp, coin, buff: { pItem, pCoin }
                    });
                }

                return new SetPenaltyCommand(
                    userId,
                    penalty!.penaltyDuration
                );
            })
        )
    }

}