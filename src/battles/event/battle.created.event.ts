import { BattleDTO } from "../dto";
import { UserEvent } from "../../common";

export class BattleCreatedEvent extends UserEvent {
   constructor(
       userId: number,
       battle: BattleDTO
   ) { super(userId, "battle", battle ); }
}