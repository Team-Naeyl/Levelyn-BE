import { ItemDTO } from "../../../game/items/dto";
import { UserOwningDTO } from "../user.owning.dto";

export type UserItemDTO = UserOwningDTO<ItemDTO>;