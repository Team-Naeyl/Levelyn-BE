import { SkillRequirementDTO } from "./skill.requirement.dto";

type __MappedType<T> = {
    [P in keyof T]?: T[P] | [T[P], T[P]];
};

export type GetSkillsByRequirementDTO = __MappedType<SkillRequirementDTO>;