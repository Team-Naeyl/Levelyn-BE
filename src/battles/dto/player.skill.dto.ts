import { SkillDTO } from "../../game/skills/dto";

export type PlayerSkillDTO
    = SkillDTO & { active: boolean; }