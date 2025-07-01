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

    @ApiProperty({ type: "integer", description: "현재 위치, 완료한 할 일의 수와 동일함" })
    position: number;
}