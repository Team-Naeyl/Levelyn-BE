import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class WalletSchema {
    @ApiProperty({ type: "integer" })
    coin: number;
}