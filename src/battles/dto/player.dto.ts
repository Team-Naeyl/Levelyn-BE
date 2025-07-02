import { SkillDTO } from "../../game/skills/dto";

export interface PlayerDTO {
    attack: number;
    will: number;
    skills: SkillDTO[];
}