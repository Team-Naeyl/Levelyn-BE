import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { SkillSchema, UserSkillSchema } from "./schema";

@ApiExtraModels(SkillSchema, UserSkillSchema)
export class GetUserSkillsResponse {
    @ApiProperty({ type: [SkillSchema], description: "전체 스킬" })
    skills: SkillSchema[];

    @ApiProperty({ type: [UserSkillSchema], description: "사용 가능한 스킬" })
    userSkills: UserSkillSchema[];
}