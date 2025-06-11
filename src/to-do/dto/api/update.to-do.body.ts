import { PartialType } from "@nestjs/swagger";
import { CreateToDoBody } from "./create.to-do.body";

export class UpdateToDoBody extends PartialType(CreateToDoBody) {}