import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { Random } from "random";
import { head, map, pipe, scan, tap, toArray } from "@fxts/core";
import { ItemTargetDTO } from "../dto";
import { ItemsService } from "../../items";

const REDIS_KEY = "item-gacha";

@Injectable()
export class RandomItemService implements OnModuleInit {
    private readonly _logger: Logger = new Logger(RandomItemService.name);
    private _upperBound: number = 0;

    constructor(
        @Inject(ItemsService)
        private readonly _itemsService: ItemsService,
        @Inject(Redis)
        private readonly _redis: Redis,
        @Inject(Random)
        private readonly _random: Random
    ) {}

    async onModuleInit(): Promise<void> {
        const targets = await this.loadItemTargets();
        await this.storeItemTargets(targets);
        this._upperBound = targets.at(-1)!.weight;
        this._logger.log("upper bound", this._upperBound);
    }

    pickItem(): Promise<number> {
        return pipe(
            this._random.float(0, this._upperBound),
            w => this._redis.zrangebyscore(
                REDIS_KEY,
                w, this._upperBound,
                "LIMIT",
                0, 1
            ),
            head,
            tap(itemId => this._logger.log(itemId)),
            Number
        );
    }

    private async loadItemTargets(): Promise<ItemTargetDTO[]> {
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

    private async storeItemTargets(targets: ItemTargetDTO[]): Promise<void> {
        for (const { itemId, weight } of targets)
            await this._redis.zadd(REDIS_KEY, weight, itemId.toString());
    }

}