import { Inject, Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { filter, from, map, mergeMap, Observable } from "rxjs";
import { ToDoFulfilledEvent } from "../to-do/event";
import { RewardUserCommand } from "../rewards/reward.user.command";
import { CreateBattleCommand } from "../battles/command";
import { TilesService } from "./tiles.service";

@Injectable()
export class TilesSaga {

    constructor(
       @Inject(TilesService)
       private readonly _tilesService: TilesService
    ) {}

    @Saga()
    tileSaga(event$: Observable<any>): Observable<RewardUserCommand | CreateBattleCommand> {
        return event$.pipe(
            ofType(ToDoFulfilledEvent),
            mergeMap(({ userId }: ToDoFulfilledEvent) =>
                from(this._tilesService.clearTile(userId))
            ),
            filter(({ penalty }) => !penalty),
            map(({ userId, position, battle }) => {
                return battle
                    ? new CreateBattleCommand(userId, position)
                    : new RewardUserCommand({ userId });
            })
        );
    }




}