import { SkillDTO } from "../../../skills/dto";
import { UserOwningDTO } from "../user.owning.dto";

export type UserSkillDTO = UserOwningDTO<SkillDTO>;