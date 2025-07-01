import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { UserItemSchema, UserSkillSchema } from "./schema";

@ApiExtraModels(UserItemSchema)
export class ItemsAddedNotification {
    @ApiProperty({ type: [UserItemSchema], description: "추가된 아이템들" })
    newItems: UserItemSchema[]
}

@ApiExtraModels(UserSkillSchema)
export class SkillsAddedNotification {
    @ApiProperty({ type: [UserSkillSchema], description: "해금된 스킬" })
    newSkills: UserSkillSchema[];
}