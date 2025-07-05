import { PlayerSkillDTO } from "./player.skill.dto";

export interface PlayerDTO {
    level: number;
    exp: number;
    attack: number;
    will: number;
    skills: PlayerSkillDTO[]
}