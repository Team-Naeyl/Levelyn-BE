import { ArrayMaxSize, IsNotEmpty, IsNumber } from "class-validator";

export class UpdateSlotBody {
    @ArrayMaxSize(3)
    @IsNumber({}, { each: true })
    @IsNotEmpty()
    skillIds: number[]
}