import { BattleRewardEvent } from "./battle.reward.event";

export type BattleRewardDTO = Omit<BattleRewardEvent, "userId">;