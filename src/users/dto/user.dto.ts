import { DashboardDTO } from "../../dashboards/dto";
import { WalletDTO } from "../../wallets/dto";

export interface UserDTO {
    id: number;
    openId: string;
    name: string;
    dashboard: DashboardDTO,
    wallet: WalletDTO
}