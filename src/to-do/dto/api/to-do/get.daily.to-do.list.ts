import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";
import { Transform } from "class-transformer";

export class GetDailyToDoListQuery {
    @ApiProperty()
    @IsDateString()
    @Transform(({ value }) => new Date(value))
    date: Date;
}