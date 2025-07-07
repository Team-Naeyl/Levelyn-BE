import { ApiProperty, ApiSchema } from "@nestjs/swagger";

@ApiSchema()
export class TileSchema {
    @ApiProperty({ type: "integer", description: "현재 위치" })
    position: number;

    @ApiProperty({ type: "integer", description: "" })
    penaltyCount: number;
}