import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class GoalSchema {
    @ApiProperty()
    description: string;

    @ApiProperty()
    since: Date;

    @ApiProperty()
    until: Date;
}