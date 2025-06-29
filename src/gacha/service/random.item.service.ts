import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { Random } from "random";
import { head, pipe } from "@fxts/core";
import { ItemTargetsService } from "./item.targets.service";

const REDIS_KEY = "item-gacha";

@Injectable()
export class RandomItemService implements OnModuleInit {
    private readonly _logger: Logger = new Logger(RandomItemService.name);
    private _upperBound: number = 0;

    constructor(
        @Inject(ItemTargetsService)
        private readonly _targetsService: ItemTargetsService,
        @Inject(Redis)
        private readonly _redis: Redis,
        @Inject(Random)
        private readonly _random: Random
    ) {}

    async onModuleInit(): Promise<void> {
        const targets = await this._targetsService.loadItemTargets();
        this._upperBound = targets.at(-1)!.weight;

        for (const { itemId, weight } of targets)
            await this._redis.zadd(REDIS_KEY, weight, itemId.toString());
    }

    pickItem(): Promise<number> {
        return pipe(
            this._random.float(0, this._upperBound),
            w => this._redis.zrange(
                REDIS_KEY,
                w, this._upperBound,
                "LIMIT",
                0, 1
            ),
            head,
            Number
        );
    }


}