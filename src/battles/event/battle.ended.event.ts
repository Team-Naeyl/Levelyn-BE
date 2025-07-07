import { BattleResult } from "../dto";
import { BattlePenalty, BattleReward } from "../schema";

interface IBattleEndedEvent {
    userId: number;
    reward: BattleReward | null;
    penalty: BattlePenalty | null;
}

export class BattleEndedEvent {
    readonly userId: number;
    readonly reward: BattleReward | null;
    readonly penalty: BattlePenalty | null;

    constructor(data: IBattleEndedEvent) {
        Object.assign(this, data);
    }
}