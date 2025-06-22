import { UserSkillDTO } from "./user.skill.dto";
import { SkillEffectDTO } from "../../../game/skills/dto";

export interface SkillsSlotDTO {
    skills: UserSkillDTO[];
    effects: { [index: number]: SkillEffectDTO; };
}