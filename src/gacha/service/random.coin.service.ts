import { Inject, Injectable } from "@nestjs/common";
import { Random } from "random";
import { MIN_COIN } from "../token";

@Injectable()
export class RandomCoinService {
    readonly getCoin: () => number;

    constructor(
        @Inject(Random) random: Random,
        @Inject(MIN_COIN) minCoin: number
    ) { this.getCoin = random.pareto(minCoin); }

}