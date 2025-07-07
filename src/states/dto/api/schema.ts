import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class StateSchema {
    @ApiProperty({ type: "integer" })
    level: number;

    @ApiProperty({ type: "number", description: "경험치" })
    exp: number;

    @ApiProperty({ type: "number", description: "공격력" })
    attack: number;

    @ApiProperty({ type: "number", description: "의지력" })
    will: number;
}