import { DashboardDTO } from "../../dashboards/dto";
import { WalletDTO } from "../../wallets/dto";

export interface SignInResult {
    accessToken: string;
    refreshToken: string;
    dashboard: DashboardDTO,
    wallet: WalletDTO
}