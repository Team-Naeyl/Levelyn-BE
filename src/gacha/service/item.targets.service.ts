import { Inject, Injectable, Logger } from "@nestjs/common";
import { ItemsService } from "../../game/items";
import { ItemTargetDTO } from "../dto";
import { map, pipe, scan, toArray } from "@fxts/core";

@Injectable()
export class ItemTargetsService {
    private readonly _logger: Logger = new Logger(ItemTargetsService.name);

    constructor(
        @Inject(ItemsService)
        private readonly _itemsService: ItemsService,
    ) {}

    async loadItemTargets(): Promise<ItemTargetDTO[]> {
        return pipe(
            await this._itemsService.getAllItems(),
            map(({ id: itemId , weight }) => ({
                itemId, weight
            }) as ItemTargetDTO),
            scan((i1, i2) => {
                i2.weight += i1.weight;
                return i2;
            }),
            toArray
        );
    }
}