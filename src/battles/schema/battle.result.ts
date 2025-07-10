
interface IBattleResult {
    mobId: number;
    startAt: Date;
    endAt: Date;
    win: boolean;
}

export class BattleResult {
    readonly mobId: number;
    readonly startAt: Date;
    readonly endAt: Date;
    readonly win: boolean;

    constructor(data: IBattleResult) {
        Object.assign(this, data);
    }
}
