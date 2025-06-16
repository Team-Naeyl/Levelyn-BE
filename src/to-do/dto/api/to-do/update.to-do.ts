import { PartialType } from "@nestjs/swagger";
import { CreateToDoBody } from "./create.to-do";

export class UpdateToDoBody extends PartialType(CreateToDoBody) {}