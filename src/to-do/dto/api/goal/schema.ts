import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class GoalSchema {
    @ApiProperty({ type: "string", description: "목표 내용" })
    description: string;

    @ApiProperty({ type: Date, description: "시작일" })
    since: Date;

    @ApiProperty({ type: Date, description: "종료일" })
    until: Date;
}