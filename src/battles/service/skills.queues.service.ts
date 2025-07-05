import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { pipe } from "@fxts/core";

@Injectable()
export class SkillsQueuesService {

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis
    ) {}

    async createSkillQueue(id: number, skillIds: number[]) {
        await this._redis.rpush(
            `$skill_queue:${id}`,
            ...skillIds
        );
    }

    async getCurrentSkillId(id: number): Promise<number> {

        const skillId = pipe(
            await this._redis.lpop(`$skill_queue:${id}`),
            Number
        );

        await this._redis.rpush(`$skill_queue:${id}`, skillId);
        return skillId;
    }

    async deleteSkillQueue(id: number): Promise<void> {
        await this._redis.del(`$skill_queue:${id}`);
    }
}