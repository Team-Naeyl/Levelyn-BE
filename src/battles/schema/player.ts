import { StatSchema } from "./stat.schema";
import { SkillSchema } from "./skill.schema";

export interface Player {
    stat: StatSchema;
    skills: SkillSchema[];
}