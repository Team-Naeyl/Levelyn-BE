import { GoalSchema } from "./schema";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

@ApiExtraModels(GoalSchema)
export class GetCurrentGoalResponse {
    @ApiProperty({ type: GoalSchema, nullable: true, description: "현재 목표" })
    result: GoalSchema | null;
}