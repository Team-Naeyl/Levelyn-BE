import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsNotPast } from "../../../../common";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { ToDoPeriodSchema } from "./schema";
import { Type } from "class-transformer";

@ApiExtraModels(ToDoPeriodSchema)
export class CreateToDoBody {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotPast()
    date: Date;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isSub: boolean;

    @ApiProperty()
    @IsOptional()
    @ValidateNested()
    @Type(() => ToDoPeriodSchema)
    period?: ToDoPeriodSchema;
}