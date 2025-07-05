import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class TurnSchema {
    @ApiProperty({ type: "integer", description: "사용된 스킬 아이디" })
    skillId: number;
    @ApiProperty({ type: "number", description: "턴이 끝난 후 몬스터 체력" })
    mobHp: number;
    @ApiProperty({ type: "number", description: "몬스터에게 가해진 데미지" })
    damage: number;
}