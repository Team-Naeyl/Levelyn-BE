import { MonsterDTO } from "../../game/monsters/dto";
import { PlayerDTO } from "./player.dto";

export interface BattleDTO {
    id: string;
    regionId: number;
    player: PlayerDTO;
    monsters: MonsterDTO[];
}