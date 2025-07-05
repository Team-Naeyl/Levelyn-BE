import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class PlayerSkillSchema {
    @ApiProperty({ name: "id", type: "integer" })
    id: number;

    @ApiProperty({ name: "name", type: "string", description: "스킬명" })
    name: string;

    @ApiProperty({ name: "description", type: "string", description: "스킬 상세설명" })
    description: string;
}