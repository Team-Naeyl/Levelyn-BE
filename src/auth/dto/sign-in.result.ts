import { PlayerDTO } from "../../players/dto";
import { WalletDTO } from "../../wallets/dto";


export interface SignInResult {
    accessToken: string;
    refreshToken: string;
    player: Omit<PlayerDTO, "id">;
    wallet: Omit<WalletDTO, "id">;
}