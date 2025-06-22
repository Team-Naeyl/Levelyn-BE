import { BattleDTO } from "./battle.dto";

export interface StartBattleResult {
    prepared: boolean;
    battle: BattleDTO | null;
}