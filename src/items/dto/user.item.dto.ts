import { ItemDTO } from "./item.dto";

export interface UserItemDTO {
    id: number;
    equipped: boolean;
    item: ItemDTO;
}