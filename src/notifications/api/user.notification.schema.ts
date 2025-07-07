import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class UserNotificationSchema {
    @ApiProperty({ type: "string" })
    type: string;
    @ApiProperty({ type: "object", properties: {} })
    payload: any;
}