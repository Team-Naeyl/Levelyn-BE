import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import Redis from "ioredis";
import { Battle } from "../schema";
import { isNil, pipe, tap, throwIf } from "@fxts/core";
import { plainToInstance } from "class-transformer";

@Injectable()
export class GetBattleService {
    private readonly _logger: Logger = new Logger(GetBattleService.name);

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis
    ) {}

    async getBattle(id: string): Promise<Battle> {
        return pipe(
            await this._redis.call("JSON.GET", `battle:${id}`, "$"),
            tap(raw => this._logger.log(raw)),
            throwIf(isNil, () => new NotFoundException()),
            raw => JSON.parse(raw as string),
            data => plainToInstance(Battle, data)[0],
        );
    }

}