import { Inject, Injectable } from "@nestjs/common";
import { Random } from "random";
import { P_COIN, P_ITEM } from "../token";
import { GachaResultConfig } from "../dto";

@Injectable()
export class GachaResultConfigService {
    private readonly returnItem: () => number;
    private readonly returnCoin: () => number;

    constructor(
       @Inject(Random) random: Random,
       @Inject(P_ITEM) pItem: number,
       @Inject(P_COIN) pCoin: number
    ) {
        this.returnItem = random.binomial(1, pItem);
        this.returnCoin = random.binomial(1, pCoin);
    }

    getConfig(): GachaResultConfig {
        return {
            item: Boolean(this.returnItem()),
            coin: Boolean(this.returnCoin())
        };
    }
}