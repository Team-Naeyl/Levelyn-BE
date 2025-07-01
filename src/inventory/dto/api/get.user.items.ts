import { UserItemSchema } from "./schema";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";

@ApiExtraModels(UserItemSchema)
export class GetUserItemsResponse {
    @ApiProperty({ type: [UserItemSchema], description: "유저가 소유한 아이템들" })
    results: UserItemSchema[]
}