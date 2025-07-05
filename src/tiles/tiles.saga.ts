import { Inject, Injectable } from "@nestjs/common";
import { Random } from "random";
import { TileConfig } from "../game";
import { ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { ToDoFulfilledEvent } from "../to-do/event";
import { RewardUserCommand } from "../rewards/command";
import { CreateBattleCommand } from "../battles/command";

@Injectable()
export class TilesSaga {
    private readonly isBattleEvent: () => boolean;

    constructor(
        @Inject(Random)
        random: Random,
        @Inject(TileConfig)
        { pBattleEvent }: TileConfig
    ) {
        const dist = random.binomial(1, pBattleEvent);
        this.isBattleEvent = () => Boolean(dist());
    }

    @Saga()
    tileSaga(event$: Observable<any>): Observable<RewardUserCommand | CreateBattleCommand> {
        return event$.pipe(
            ofType(ToDoFulfilledEvent),
            map(({ userId }: ToDoFulfilledEvent) =>
                this.isBattleEvent()
                    ? new RewardUserCommand({ userId })
                    : new CreateBattleCommand(userId)
            )
        );
    }


}