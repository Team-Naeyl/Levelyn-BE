import { ApiProperty } from "@nestjs/swagger";

export class UserRewardedNotification {
    @ApiProperty({ type: "number", description: "획득한 경험치" })
    exp: number;

    @ApiProperty({ type: "integer", nullable: true, description: "획득한 아이템의 아이디, 보상 없을시 null" })
    itemId: number | null;

    @ApiProperty({ type: "integer", description: "획득한 코인, 보상 없을시 0" })
    coin: number;
}