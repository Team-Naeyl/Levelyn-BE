import { ApiProperty } from "@nestjs/swagger";
import { IsDate } from "class-validator";
import { Transform } from "class-transformer";

export class GetDailyToDoListQuery {
    @ApiProperty({ type: Date, description: "할 일 조회할 날짜" })
    @IsDate()
    @Transform(({ value }) => new Date(value))
    date: Date;
}