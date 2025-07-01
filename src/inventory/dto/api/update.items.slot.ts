import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateItemsSlotBody {
    @ApiProperty({
        type: "array",
        items: { type: "integer" },
        required: true,
        description: "장착 상태를 바꿀 아이템들의 id 값들"
    })
    @IsNumber({}, { each: true })
    itemIds: number[];
}