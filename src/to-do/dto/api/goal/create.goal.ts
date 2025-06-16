import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IsNotPast, IsRange } from "../../../../common";

export class CreateGoalBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsRange()
    @IsNotPast({ each: true })
    range: [Date, Date];
}