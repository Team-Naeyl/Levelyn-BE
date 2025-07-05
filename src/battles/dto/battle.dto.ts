import { PlayerDTO } from "./player.dto";
import { MobDTO } from "./mob.dto";

export interface BattleDTO {
    id: string;
    player: PlayerDTO;
    mob: MobDTO;
}