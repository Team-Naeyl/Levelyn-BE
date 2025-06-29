export interface BattleRewardEvent {
    userId: number;
    exp: number;
    itemId: number | null;
    coin: number | null;
}