import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { IsNotPast } from "../../../../common";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { ToDoPeriodSchema } from "./schema";
import { Type } from "class-transformer";

@ApiExtraModels(ToDoPeriodSchema)
export class CreateToDoBody {
    @ApiProperty({ type: "string", description: "할 일 내용", required: true })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ type: Date, description: "실행일", required: true })
    @IsNotPast()
    date: Date;

    @ApiProperty({ type: "boolean", description: "하위 할 일 여부", required: false })
    @IsOptional()
    @IsBoolean()
    isSub?: boolean;

    @ApiProperty({ type: ToDoPeriodSchema, description: "반복 주기", required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => ToDoPeriodSchema)
    period?: ToDoPeriodSchema;
}