import { MakeRewardDTO, RewardDTO, RewardUserResult } from "../dto";
import { Inject, Injectable } from "@nestjs/common";
import { RandomBoxesService, RewardConfig } from "../../game";
import { RewardUserDTO } from "../dto";
import { ApplyRewardService } from "./apply.reward.service";

@Injectable()
export class RewardsService {
    readonly expReward: number;

    constructor(
       @Inject(RandomBoxesService)
       private readonly _randomBoxService: RandomBoxesService,
       @Inject(ApplyRewardService)
       private readonly _applyRewardService: ApplyRewardService,
       @Inject(RewardConfig)
       { exp }: RewardConfig
    ) {
        this.expReward = exp;
    }

    async rewardUser(dto: RewardUserDTO): Promise<RewardUserResult> {
        const { userId, ...rest } = dto;
        const reward = await this.makeReward(rest);
        await this._applyRewardService.applyReward(userId, reward);
        return { userId, ...reward };
    }

    async makeReward(dto: MakeRewardDTO): Promise<RewardDTO> {
        const { exp, coin, buff } = dto;
        const randomBox = await this._randomBoxService.getRandomBox(buff);

        return {
            exp: (exp ?? 0) + this.expReward,
            itemId: randomBox.itemId,
            coin: (coin ?? 0) + randomBox.coin
        };
    }
}