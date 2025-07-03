import { RewardUserResult } from "../dto";

export class UserRewardedEvent implements RewardUserResult {
    userId: number;
    exp: number;
    coin: number;
    itemId: number | null;

    constructor(data: RewardUserResult) {
        Object.assign(this, data);
    }
}