import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { Battle } from "./schema";
import * as crypto from "node:crypto";

@Injectable()
export class BattlesRepository {

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis,
    ) {}

    async saveBattle(attributes: Omit<Battle, "id">): Promise<Battle> {
        const id = crypto.randomUUID().replaceAll('-', '');
        const battle: Battle = Object.assign(attributes, { id });
        await this._redis.hmset("battles", id, JSON.stringify(battle));
        return battle;
    }

    async findBattleById(id: string): Promise<Battle | null> {
        const raws = await this._redis.hmget("battles", id);
        return raws[0] ? JSON.parse(raws[0]) as Battle : null;
    }
}