
interface IPlayerStat {
    attack: number;
    will: number;
}

export class PlayerStat implements IPlayerStat {
    attack: number;
    will: number;

    constructor(data: IPlayerStat) {
        Object.assign(this, data);
    }
}