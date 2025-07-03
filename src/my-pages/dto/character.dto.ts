import { UserDTO } from "../../users/dto";
import { UserItemDTO, UserSkillDTO } from "../../inventory/dto";

export type CharacterDTO
    = Pick<UserDTO, "state" | "wallet">
    & { itemsSlot: UserItemDTO[]; }
    & { skillsSlot: UserSkillDTO[]; };