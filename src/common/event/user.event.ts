import { EventBase } from "./event.base";

export class UserEvent extends EventBase {
    constructor(
        public readonly userId: number,
        context: string
    ) {
        super(context);
    }
}