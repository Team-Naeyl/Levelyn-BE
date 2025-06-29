export interface GachaOptions {
    pItem: number;
    pCoin: number;
    minCoin: number;
}

export type GachaOptionsFactory
    = (...args: any[]) => GachaOptions | Promise<GachaOptions>;