import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { IsRange } from "../../../common";
import { ApiProperty } from "@nestjs/swagger";

export class CreateToDoBody {
    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsRange()
    @IsDate({ each: true })
    period: [Date, Date]

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    targetCount?: number;
}