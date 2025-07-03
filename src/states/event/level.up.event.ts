
export class LevelUpEvent{
    constructor(
        public readonly userId: number,
        public readonly level: number
    ) {}
}