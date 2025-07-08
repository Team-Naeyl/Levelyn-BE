import { SkillDTO } from "../../game/skills/dto";
import { UserEvent } from "../../common";

export class UserLevelUpEvent extends UserEvent {
    constructor(
        userId: number,
        level: number,
        newSKills: SkillDTO[],
    ) {
        super(userId, "level.up", { level, newSKills });
    }
}