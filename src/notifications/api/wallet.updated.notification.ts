import { ApiProperty } from "@nestjs/swagger";

export class WalletUpdatedNotification {
    @ApiProperty({ type: "integer", description: "코인 변화량" })
    deltaCoin: number;

    @ApiProperty({ type: "integer", description: "현재 코인 보유량" })
    coin: number;
}