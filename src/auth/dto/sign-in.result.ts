import { WalletDTO } from "../../wallets/dto";
import { UserStateDTO } from "../../states/dto";

export interface SignInResult {
    accessToken: string;
    refreshToken: string;
    status: UserStateDTO;
    wallet: WalletDTO
}