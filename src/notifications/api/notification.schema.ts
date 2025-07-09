import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class NotificationSchema {
    @ApiProperty({ type: "string" })
    event: string;
    @ApiProperty({ type: "object", properties: {} })
    data: any;
}