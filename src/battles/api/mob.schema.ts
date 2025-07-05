import { ApiExtraModels, ApiProperty, ApiSchema } from "@nestjs/swagger";
import { TypeSchema } from "../../game/common";

@ApiSchema()
@ApiExtraModels(TypeSchema)
export class MobSchema {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: TypeSchema })
    type: TypeSchema;

    @ApiProperty({ type: "string" })
    name: string;

    @ApiProperty({ type: "number" })
    hp: number;
}