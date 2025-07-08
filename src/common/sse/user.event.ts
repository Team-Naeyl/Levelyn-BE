export class UserEvent {
    constructor(
        public readonly userId: number,
        public readonly sub: string,
        public readonly data: any
    ) {}
}