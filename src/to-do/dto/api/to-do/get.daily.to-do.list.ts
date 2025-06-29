import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { Transform } from "class-transformer";

export class GetDailyToDoListQuery {
    @ApiProperty({ type: "string", description: "할 일 조회할 날짜를 ISO" })
    @IsDateString()
    @Transform(({ value }) => new Date(value))
    date: Date;
}