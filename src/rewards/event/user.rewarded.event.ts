import { RewardUserResult } from "../dto";
import { UserEvent } from "../../common";

export class UserRewardedEvent extends UserEvent {
   constructor(userId: number, result: RewardUserResult) {
       super(userId, "rewarded", result);
   }
}