import { RewardDTO } from "./reward.dto";

export interface ApplyRewardDTO {
    userId: number;
    reward: RewardDTO;
}