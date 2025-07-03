import { PartialType } from "@nestjs/swagger";
import { ProfileSchema } from "./schema";

export class UpdateProfileBody extends PartialType(ProfileSchema) {}