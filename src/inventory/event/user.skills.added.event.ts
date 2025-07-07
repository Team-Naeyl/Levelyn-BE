import { UserSkillDTO } from "../dto";
import { UserNotificationEvent } from "../../common";


export class UserSkillsAddedEvent
    extends UserNotificationEvent<
        "user.skills.added",
        { newSkills: UserSkillDTO[] }
    >
{
    constructor(userId: number, newSkills: UserSkillDTO[]) {
        super({
            userId,
            type: "user.skills.added",
            payload: { newSkills }
        });
    }
}