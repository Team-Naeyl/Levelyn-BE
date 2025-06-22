import { ObjectField } from "../../config/redis";

export class BattleRewardSchema {
    @ObjectField({ type: "number" })
    exp: number;

    @ObjectField({ type: "number" })
    pItem: number;

    @ObjectField({ type: "number" })
    pCoin: number;
}