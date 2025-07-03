import { ApiProperty } from "@nestjs/swagger";

export class LevelUpNotification {
    @ApiProperty({ type: "integer", description: "현재 레벨" })
    level: number;
}