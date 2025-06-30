import { ApiProperty } from "@nestjs/swagger";

export class FulfillToDoResponse {
    @ApiProperty({ type: "number", description: "획득한 경험치" })
    exp: number;
    @ApiProperty({ type: "integer", nullable: true, description: "획득한 아이템의 id" })
    itemId: number | null;
    @ApiProperty({ type: "integer", nullable: true, description: "획득한 코인" })
    coin: number | null;
    @ApiProperty({ type: "boolean", description: "전투 발생 여부" })
    isBattle: boolean;
}