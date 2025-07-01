import { ApiProperty } from "@nestjs/swagger";

export class CoinEarnedNotification {
    @ApiProperty({ type: "integer", description: "코인 증가량" })
    deltaCoin: number;
}