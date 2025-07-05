import { ApiExtraModels, ApiProperty, ApiSchema, OmitType } from "@nestjs/swagger";
import { TypeSchema } from "../../../game/common";

@ApiExtraModels(TypeSchema)
@ApiSchema()
export class UserItemSchema {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: TypeSchema })
    type: TypeSchema;

    @ApiProperty({ type: "string", description: "아이템명" })
    name: string;

    @ApiProperty({ type: "string", description: "아이템 상세설명" })
    description: string;

    @ApiProperty({ type: "boolean", description: "아아템 착용여부" })
    equipped: boolean;
}

@ApiSchema()
export class UserSkillSchema {
    @ApiProperty({ name: "id", type: "integer" })
    id: number;

    @ApiProperty({ name: "name", type: "string", description: "스킬명" })
    name: string;

    @ApiProperty({ name: "description", type: "string", description: "스킬 상세설명" })
    description: string;

    @ApiProperty({ name: "equipped", type: "boolean", description: "스킬 장착여부" })
    equipped: boolean;
}

@ApiSchema()
export class SkillSchema extends OmitType(UserSkillSchema, ["equipped"]) {}