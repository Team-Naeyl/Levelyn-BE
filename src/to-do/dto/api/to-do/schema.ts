import { ApiExtraModels, ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsIn, IsInt, Min } from "class-validator";

@ApiSchema()
export class ToDoPeriodSchema {
    @ApiProperty()
    @IsIn(["days", "weeks", "months", "years"])
    unit: "days" | "weeks" | "months" | "years";

    @ApiProperty()
    @Min(1)
    @IsInt()
    amount: number;
}


@ApiSchema()
@ApiExtraModels(ToDoPeriodSchema)
export class ToDoSchema {
    @ApiProperty()
    id: number;

    @ApiProperty()
    description: string;

    @ApiProperty()
    date: Date;

    @ApiProperty()
    isSub: boolean;

    @ApiProperty()
    completed: boolean;

    @ApiProperty()
    period: ToDoPeriodSchema | null;
}