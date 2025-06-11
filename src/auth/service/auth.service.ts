import { Inject, Injectable, Logger } from '@nestjs/common';
import { UsersService } from "../../users";
import { SignInDTO, SignInResult } from "../dto";
import { JwtService } from "../../config/jwt";
import { BlacklistService } from "./blacklist.service";

@Injectable()
export class AuthService {
    private readonly _logger: Logger = new Logger(AuthService.name);

    constructor(
        @Inject(UsersService)
        private readonly _usersService: UsersService,
        @Inject(JwtService)
        private readonly _jwtService: JwtService,
        @Inject(BlacklistService)
        private readonly _blacklist: BlacklistService,
    ) {}

    async signIn(dto: SignInDTO): Promise<SignInResult> {
        const { id, dashboard, wallet } = await this._usersService.upsertUser(dto);
        const userInfo = { id, dashboardId: dashboard.id, walletId: wallet.id };
        const accessToken = this._jwtService.signAccess(userInfo);
        const refreshToken = this._jwtService.signRefresh(userInfo);
        return { accessToken, refreshToken, dashboard, wallet };
    }

    async signOut(authorization: string): Promise<void> {
        await this._blacklist.add(authorization);
    }

    async renew(refreshToken: string): Promise<string> {
        const { id, dashboardId, walletId } = await this._jwtService.verify(refreshToken);
        return this._jwtService.signAccess({ id, dashboardId, walletId });
    }
}
