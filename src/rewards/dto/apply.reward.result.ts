import { UserItemDTO } from "../../inventory/dto";

export interface ApplyRewardResult {
    exp: number;
    items: UserItemDTO[];
    coin: number;
}