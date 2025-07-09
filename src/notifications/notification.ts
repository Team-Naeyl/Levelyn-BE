export class UserNotification {
    constructor(
        public readonly subject: string,
        public readonly payload: any
    ) {}
}