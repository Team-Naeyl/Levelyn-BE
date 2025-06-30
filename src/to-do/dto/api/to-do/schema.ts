import { ApiExtraModels, ApiProperty, ApiSchema, refs } from "@nestjs/swagger";
import { IsIn, IsInt, Min } from "class-validator";

@ApiSchema()
export class ToDoPeriodSchema {
    @ApiProperty({ type: "string", description: "반복 주기의 단위/days, weeks, months, years 중 1개의 값" })
    @IsIn(["days", "weeks", "months", "years"])
    unit: "days" | "weeks" | "months" | "years";

    @ApiProperty({ type: "integer", description: "반복 주기의 크기" })
    @Min(1)
    @IsInt()
    amount: number;
}


@ApiSchema()
@ApiExtraModels(ToDoPeriodSchema)
export class ToDoSchema {
    @ApiProperty({ type: "integer" })
    id: number;

    @ApiProperty({ type: "string", description: "할 일 내용" })
    description: string;

    @ApiProperty({ type: Date, description: "실행일" })
    date: Date;

    @ApiProperty({ type: "boolean", description: "하위 할 일 여부" })
    isSub: boolean;

    @ApiProperty({ type: "boolean", description: "완료 여부" })
    completed: boolean;

    @ApiProperty({ type: ToDoPeriodSchema, description: "반복 주기", nullable: true })
    period: ToDoPeriodSchema | null;
}