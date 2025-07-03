import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { UserSkillSchema } from "../../inventory/dto";

@ApiExtraModels(UserSkillSchema)
export class UserSkillsAddedNotification {
    @ApiProperty({ type: [UserSkillSchema], description: '스킬 해금 알림' })
    newSkills: UserSkillSchema[];
}