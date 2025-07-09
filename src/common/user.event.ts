import { IEvent } from "@nestjs/cqrs";

export class UserEvent implements IEvent {
    constructor(
        public readonly userId: number,
        public readonly event: string,
        public readonly data: any
    ) {}
}