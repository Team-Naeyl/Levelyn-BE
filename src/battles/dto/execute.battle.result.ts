import { BattleTurnResult } from "./battle.turn.result";
import { BattleResult } from "./battle.result";

export interface ExecuteBattleResult {
    status: "RUNNING" | "DONE";
    payload: BattleTurnResult | BattleResult;
}