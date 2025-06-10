import { SkillDTO } from "../../../skills/dto";

export interface UserSkillDTO {
    id: number;
    equipped: boolean;
    skill: SkillDTO;
}