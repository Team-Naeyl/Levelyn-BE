import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { UserItemSchema } from "../../inventory/dto";

@ApiExtraModels(UserItemSchema)
export class UserItemsAddedNotification {
    @ApiProperty({ type: [UserItemSchema], description: '새로 추가된 아이템' })
    newItems: UserItemSchema[];
}