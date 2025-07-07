import { StateDTO } from "../../states/dto";
import { WalletDTO } from "../../wallets/dto";
import { TileDTO } from "../../tiles/dto";


export interface SignInResult {
    accessToken: string;
    refreshToken: string;
    state: StateDTO;
    tile: TileDTO;
    wallet: WalletDTO;
}