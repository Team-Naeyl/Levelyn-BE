import { UserItemSchema } from "./schema";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

@ApiExtraModels(UserItemSchema)
export class GetUserItemsResponse {
    @ApiProperty({ name: "results", type: [UserItemSchema] })
    results: UserItemSchema[]
}