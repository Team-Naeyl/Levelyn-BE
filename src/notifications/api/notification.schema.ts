import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class NotificationSchema {
    @ApiProperty({ type: "string" })
    subject: string;
    @ApiProperty({ type: "object", properties: {} })
    payload: any;
}