import { SkillDTO } from "../../../game/skills/dto";
import { UserOwningDTO } from "../user.owning.dto";

export type UserSkillDTO = UserOwningDTO<SkillDTO>;