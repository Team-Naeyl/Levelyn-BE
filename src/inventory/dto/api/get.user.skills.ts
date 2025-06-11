import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { SkillSchema, UserSkillSchema } from "./schema";

@ApiExtraModels(SkillSchema, UserSkillSchema)
export class GetUserSkillsResponse {
    @ApiProperty({ name: 'skills', type: [SkillSchema] })
    skills: SkillSchema[];

    @ApiProperty({ name: 'userSkills', type: [UserSkillSchema] })
    userSkills: UserSkillSchema[];
}