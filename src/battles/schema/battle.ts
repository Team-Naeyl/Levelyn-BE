import { Player } from "./player";
import { BattleRewardSchema } from "./battle.reward.schema";
import { MonsterSchema } from "./monster.schema";

export interface Battle {
    id: string;
    regionId: number;
    player: Player;
    reward: BattleRewardSchema;
    monsters: MonsterSchema[]
}