import { UserNotificationEvent } from "../../common";
import { BattleDTO } from "../dto";


export class BattleCreatedEvent
    extends UserNotificationEvent<
        "battle.created",
        BattleDTO
    >
{
   constructor(
       userId: number,
       battle: BattleDTO
   ) {
      super({
         userId,
         type: "battle.created",
         payload: battle
      });
   }
}