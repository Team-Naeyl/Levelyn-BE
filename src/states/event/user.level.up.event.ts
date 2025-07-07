import { UserNotificationEvent } from "../../common";
import { SkillDTO } from "../../game/skills/dto";

export class UserLevelUpEvent
    extends UserNotificationEvent<
        "user.level.up",
        { level: number; newSkills: SkillDTO[] }
    >
{

    constructor(
        userId: number,
        level: number,
        newSKills: SkillDTO[],
    ) {
        super({
            userId,
            type: "user.level.up",
            payload: { level, newSkills: newSKills  }
        })
    }
}