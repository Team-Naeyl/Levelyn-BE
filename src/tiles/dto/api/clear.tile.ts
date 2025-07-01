import { ApiProperty } from "@nestjs/swagger";

export class ClearTileResponse {
    @ApiProperty({ type: "boolean", description: "전투 발생 유뮤" })
    isBattle: boolean;
}