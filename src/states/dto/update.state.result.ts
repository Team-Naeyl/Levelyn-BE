import { SkillDTO } from "../../game/skills/dto";

export interface UpdateStateResult {
    levelUp: boolean;
    level: number;
    newSkills: SkillDTO[];
}