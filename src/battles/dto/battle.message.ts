import { BattleDTO } from "./battle.dto";
import { TurnResult } from "./turn.result";
import { BattleResult } from "./battle.result";

export type BattleMessageType = "START" | "RUN" | "END"
export type BattleMessagePayload = BattleDTO | TurnResult | BattleResult;

export interface BattleMessage {
    type: BattleMessageType;
    payload: BattleMessagePayload;
}