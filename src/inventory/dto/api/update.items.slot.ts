import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateItemsSlotBody {
    @ApiProperty({ name: "itemIds", type: "array", items: { type: "integer" }, required: true })
    @IsNumber({}, { each: true })
    itemIds: number[];
}