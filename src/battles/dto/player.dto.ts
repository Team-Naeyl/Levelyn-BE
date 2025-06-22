import { SkillDTO } from "../../game/skills/dto";

export interface PlayerDTO {
    level: number;
    attack: number;
    will: number;
    skills: SkillDTO[]
}