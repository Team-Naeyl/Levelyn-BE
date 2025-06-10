import { ItemDTO } from "../../../items/dto";

export interface UserItemDTO {
    id: number;
    equipped: boolean;
    item: ItemDTO;
}