import { RewardDTO } from "../dto";

interface IRewardedEvent extends RewardDTO {
    userId: number;
}

export class UserRewardedEvent implements IRewardedEvent {
    userId: number;
    exp: number;
    coin: number;
    itemIds: number[];

    constructor(data: IRewardedEvent) {
        Object.assign(this, data);
    }
}