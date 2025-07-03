
export class WalletUpdatedEvent {
    constructor(
        public readonly userId: number,
        public readonly deltaCoin: number,
        public readonly coin: number,
    ) {}
}