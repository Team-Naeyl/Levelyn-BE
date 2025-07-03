import { UserItemDTO } from "../dto";


export class UserItemsAddedEvent {
    constructor(
        public readonly userId: number,
        public readonly newItems: UserItemDTO[]
    ) {}
}