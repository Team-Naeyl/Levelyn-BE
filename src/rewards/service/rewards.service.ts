import { MakeRewardDTO, RewardDTO } from "../dto";
import { Inject } from "@nestjs/common";
import { RewardConfig } from "../../game/config";
import { RandomBoxesService } from "./random.boxes.service";

export class RewardsService {
    readonly expReward: number;

    constructor(
       @Inject(RandomBoxesService)
       private readonly _randomBoxService: RandomBoxesService,
       @Inject(RewardConfig)
       { exp }: RewardConfig
    ) {
        this.expReward = exp;
    }

    async makeReward(dto: MakeRewardDTO): Promise<RewardDTO> {
        const { exp, coin, buff } = dto;
        const randomBox = await this._randomBoxService.getRandomBox(buff);

        return {
            exp: exp + this.expReward,
            coin: coin + Number(randomBox.coin),
            itemIds: randomBox.itemId ? [randomBox.itemId] : []
        };
    }
}