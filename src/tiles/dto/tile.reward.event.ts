export interface TileRewardEvent {
    userId: number;
    exp: number;
    itemId: number | null;
    coin: number | null;
    isBattle: boolean;
}