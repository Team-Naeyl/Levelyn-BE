import { ApiProperty } from "@nestjs/swagger";

export class BattleCreatedNotification {
    @ApiProperty({ type: "string", description: "전투 세션 아이디" })
    battleId: string;
}