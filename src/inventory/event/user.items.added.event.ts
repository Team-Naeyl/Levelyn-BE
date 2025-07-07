import { UserItemDTO } from "../dto";
import { UserNotificationEvent } from "../../common";


export class UserItemsAddedEvent
    extends UserNotificationEvent<
        "user.items.added",
        { newItems: UserItemDTO[] }
    >
{
    constructor(
        userId: number,
        newItems: UserItemDTO[]
    ) {
        super({
            userId,
            type: "user.items.added",
            payload: { newItems }
        });
    }
}