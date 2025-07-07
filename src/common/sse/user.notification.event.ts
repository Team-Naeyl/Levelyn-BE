import { SseEvent } from "./sse.event";

interface IUserNotification<
    TypeT extends string,
    PayloadT
> {
    userId: number;
    type: TypeT;
    payload: PayloadT;
}

export class UserNotificationEvent<
    TypeT extends  string = string,
    PayloadT = any
> extends SseEvent<TypeT, PayloadT>{
    readonly userId: number;

    constructor(data: IUserNotification<TypeT, PayloadT>) {
        super(data.type, data.payload);
        this.userId = data.userId;
    }
}