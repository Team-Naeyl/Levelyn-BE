import { Inject, Injectable, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { Battle, BattleRewardSchema, MonsterSchema, Player, SkillSchema, StatSchema } from "./schema";
import { InjectStorage, RedisCircularQueue, RedisObjectStorage } from "../config/redis";

@Injectable()
export class BattlesStorage {
    private readonly _logger: Logger = new Logger(BattlesStorage.name);

    constructor(
        @Inject(Redis)
        private readonly _redis: Redis,
        @InjectStorage(StatSchema)
        private readonly _statsStorage: RedisObjectStorage<StatSchema>,
        @InjectStorage(SkillSchema)
        private readonly _skillsStorage: RedisObjectStorage<SkillSchema>,
        @InjectStorage(BattleRewardSchema)
        private readonly _rewardsStorage: RedisObjectStorage<BattleRewardSchema>,
        @InjectStorage(MonsterSchema)
        private readonly _monstersStorage: RedisObjectStorage<MonsterSchema>,
        @Inject(RedisCircularQueue)
        private readonly _skillsQueue: RedisCircularQueue
    ) {}

    async addBattle(battle: Battle) {

        const {
            id, regionId,
            player, reward, monsters
        } = battle;

        await this._redis.set(__regionIdKey(id), regionId);
        await this.setPlayer(id, player);
        await this._rewardsStorage.upsert(__rewardKey(id), reward);

        for (const monster of monsters)
            await this._monstersStorage.upsert(__monsterKey(id, monster.id), monster);

        await this._redis.set(id, Date.now());
    }

    async getBattle(id: string): Promise<Battle | null> {
        if (!await this._redis.get(id)) return null;

        const regionId = Number(await this._redis.get(__regionIdKey(id)));

        const player: Player = {
            stat: await this._statsStorage.findOne(__statKey(id)),
            skills: await this._skillsStorage.findMany(__skillKeyPattern(id))
        }

        const reward = await this._rewardsStorage.findOne(__rewardKey(id));
        const monsters = await this._monstersStorage.findMany(__monsterKeyPattern(id));

        return { id, regionId, player, reward, monsters };
    }

    private async setPlayer(id: string, player: Player): Promise<void> {
        const { stat, skills } = player;
        await this._statsStorage.upsert(__statKey(id), stat);
        await this.setSkills(id, skills);
    }

    private async setSkills(id: string, skills: SkillSchema[]): Promise<void> {
        const skillIds: number[] = [];


        for (const skill of skills) {
            await this._skillsStorage.upsert(__skillKey(id, skill.id), skill);
            skillIds.push(skill.id);
        }

        await this._skillsQueue.createQueue(__skillsQueueKey(id), skillIds);
    }

}

function __regionIdKey(battleId: string): string {
    return `${battleId}-reg`;
}

function __statKey(battleId: string): string {
    return `${battleId}-p-st`;
}

function __skillKey(battleId: string, skillId: number): string {
    return `${battleId}-p-sk-${skillId}`;
}

function __skillKeyPattern(battleId: string): string {
    return `${battleId}-p-sk-*`
}

function __skillsQueueKey(battleId: string): string {
    return `${battleId}-p-sk-q`;
}

function __rewardKey(battleId: string): string {
    return `${battleId}-rwd`;
}

function __monsterKey(battleId: string, monsterId: number): string {
    return `${battleId}-m-${monsterId}`;
}

function __monsterKeyPattern(battleId: string): string {
    return  `${battleId}-m-*`;
}