import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";


export class UpdateSkillsSlotBody {
    @ApiProperty({
        type: "array",
        items: { type: "integer" },
        required: true,
        description: "장착할 스킬들의 id 값들"
    })
    @IsNumber({}, { each: true })
    skillIds: number[];
}