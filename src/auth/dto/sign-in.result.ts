import { StateDTO } from "../../states/dto";
import { WalletDTO } from "../../wallets/dto";


export interface SignInResult {
    accessToken: string;
    refreshToken: string;
    state: StateDTO;
    wallet: WalletDTO;
}