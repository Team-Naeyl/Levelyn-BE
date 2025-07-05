import { Inject, Injectable } from "@nestjs/common";
import { MonstersService, RegionsService } from "../../../game";
import { Mob } from "../../schema";
import { pipe } from "@fxts/core";

@Injectable()
export class LoadMobService {

    constructor(
       @Inject(RegionsService)
       private readonly _regionsService: RegionsService,
       @Inject(MonstersService)
       private readonly _monstersService: MonstersService,
    ) {}

    async loadMob(position: number): Promise<Mob> {
        return pipe(
            this._regionsService.getRegion(position),
            regionId => this._monstersService.getLocalMonster(regionId),
            monster => new Mob(monster),
        );
    }
}