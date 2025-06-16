import { PartialType } from "@nestjs/swagger";
import { CreateGoalBody } from "./create.goal";

export class UpdateGoalBody extends PartialType(CreateGoalBody) {}