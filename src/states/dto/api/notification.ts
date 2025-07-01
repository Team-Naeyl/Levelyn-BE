import { StateSchema } from "./schema";
import { ApiProperty } from "@nestjs/swagger";

export class StateUpdatedNotification extends StateSchema{
    @ApiProperty({ type: "boolean", description: "레벨업 여부" })
    levelUp: boolean;
}