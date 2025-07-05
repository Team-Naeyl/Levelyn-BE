import { BattleReward } from "./battle.reward";
import { Player } from "./player";
import { Mob } from "./mob";
import { BattlePenalty } from "./battle.penalty";
import * as crypto from "node:crypto";

interface IBattle {
    id?: string;
    userId: number;
    player: Player;
    reward: BattleReward;
    penalty: BattlePenalty;
    mob: Mob;
}

export class Battle {
    readonly id: string;
    readonly userId: number;
    readonly player: Player;
    readonly mob: Mob;
    readonly reward: BattleReward;
    readonly penalty: BattlePenalty;

    constructor(data: IBattle) {
        const { id, ...rest } = data;
        this.id = id ?? crypto.randomUUID().replaceAll('-', '');
        Object.assign(this, rest);
    }
}