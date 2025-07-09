export class UserNotification {
    constructor(
        public readonly event: string,
        public readonly data: any
    ) {}
}