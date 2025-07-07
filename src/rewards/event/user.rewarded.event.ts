import { RewardUserResult } from "../dto";
import { UserNotificationEvent } from "../../common";

export class UserRewardedEvent
    extends UserNotificationEvent<"user.rewarded", RewardUserResult>
{
   constructor(userId: number, result: RewardUserResult) {
       super({
           userId,
           type: "user.rewarded",
           payload: result
       });
   }
}