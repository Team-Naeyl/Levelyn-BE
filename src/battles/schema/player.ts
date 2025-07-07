import { PlayerStat } from "./player.stat";
import { PlayerSkill } from "./player.skill";

interface IPlayer {
    level: number;
    exp: number;
    stat: PlayerStat;
    skills: PlayerSkill[];
}

export class Player implements IPlayer {
    level: number;
    exp: number;
    stat: PlayerStat;
    skills: PlayerSkill[];

    constructor(data: IPlayer) {
        Object.assign(this, data);
    }
}