import { Inject, Injectable } from "@nestjs/common";
import { Random } from "random";
import { RewardConfig } from "../../config";

@Injectable()
export class RandomCoinService {
    readonly getCoin: () => number;

    constructor(
        @Inject(Random) random: Random,
        @Inject(RewardConfig) { lambdaCoin }: RewardConfig
    ) { this.getCoin = random.poisson(lambdaCoin); }

}