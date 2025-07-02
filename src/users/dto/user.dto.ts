import { StateDTO } from "../../states/dto";
import { WalletDTO } from "../../wallets/dto";


export interface UserDTO {
    id: number;
    email: string;
    name: string;
    state: StateDTO;
    wallet: WalletDTO;
}