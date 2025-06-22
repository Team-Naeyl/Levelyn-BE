import { WalletDTO } from "../../wallets/dto";
import { UserStateDTO } from "../../states/dto";

export interface UserDTO {
    id: number;
    openId: string;
    stateId: number;
    walletId: number;
    name: string;
    state: UserStateDTO
    wallet: WalletDTO
}