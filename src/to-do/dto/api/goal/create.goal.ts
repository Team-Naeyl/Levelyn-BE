import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsNotPast, IsRange } from "../../../../common";

export class CreateGoalBody {
    @ApiProperty({ type: "string", description: "목표 내용"  })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        type: "array",
        items: { type: Date.name, maxLength: 2, minLength: 2 } ,
        description: "[시작일, 종료일] 형태의 pair, 시작일은 종료일보다 과거여야 하고, 시작일과 종료일 모두 현재보다 과거이면 안됨"
    })
    @IsRange()
    @IsNotPast({ each: true })
    range: [Date, Date];
}