import { BattleResult } from "../dto";
import { BattlePenalty, BattleReward } from "../schema";

interface IBattleEndedEvent {
    id: string;
    userId: number;
    result: BattleResult;
    reward: BattleReward;
    penalty: BattlePenalty;
}

export class BattleEndedEvent {
    readonly id: string;
    readonly userId: number;
    readonly result: BattleResult;
    readonly reward: BattleReward;
    readonly penalty: BattlePenalty;

    constructor(data: IBattleEndedEvent) {
        Object.assign(this, data);
    }
}