import { StateDTO } from "../../states/dto";
import { WalletDTO } from "../../wallets/dto";
import { TileDTO } from "../../tiles/dto";

export interface UserDTO {
    id: number;
    email: string;
    name: string;
    state: StateDTO;
    tile: TileDTO;
    wallet: WalletDTO;
}