interface IBattleReward {
    exp: number;
    coin: number;
    pItem: number;
    pCoin: number;
}

export class BattleReward implements IBattleReward {
    exp: number = 0;
    coin: number = 0;
    pItem: number = 0;
    pCoin: number = 0;

    constructor(data?: Partial<IBattleReward>) {
        data && Object.assign(this, data);
    }
}