import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";


export class UpdateSkillsSlotBody {
    @ApiProperty({ name: "skillIds", type: "array", items: { type: "integer" }, required: true })
    @IsNumber({}, { each: true })
    skillIds: number[];
}