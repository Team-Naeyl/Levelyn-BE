import { BattlePenalty, BattleResult, BattleReward } from "../schema";

interface IBattleEndedEvent {
    userId: number;
    result: BattleResult;
    reward: BattleReward | null;
    penalty: BattlePenalty | null;
}

export class BattleEndedEvent {
    readonly userId: number;
    readonly result: BattleResult;
    readonly reward: BattleReward | null;
    readonly penalty: BattlePenalty | null;

    constructor(data: IBattleEndedEvent) {
        Object.assign(this, data);
    }
}