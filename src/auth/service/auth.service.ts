import { Inject, Injectable, Logger } from '@nestjs/common';
import { UsersService } from "../../users";
import { SignInDTO, SignInResult, UserInfo } from "../dto";
import { BlacklistService } from "./blacklist.service";
import { JwtAuthService } from "./jwt.auth.service";
import { pick, pipe } from "@fxts/core";

@Injectable()
export class AuthService {
    private readonly _logger: Logger = new Logger(AuthService.name);

    constructor(
        @Inject(UsersService)
        private readonly _usersService: UsersService,
        @Inject(JwtAuthService)
        private readonly _jwtService: JwtAuthService,
        @Inject(BlacklistService)
        private readonly _blacklist: BlacklistService,
    ) {}

    async signIn(dto: SignInDTO): Promise<SignInResult> {

        const [userInfo, status, wallet] = pipe(
            await this._usersService.upsertUser(dto),
            user => [
                pick(["id", "stateId", "walletId"], user) as UserInfo,
                user.state,
                user.wallet
            ]
        );

        const accessToken = await this._jwtService.signAccess(userInfo);
        const refreshToken = await this._jwtService.signRefresh(userInfo);

        return { accessToken, refreshToken, status, wallet };
    }

    async signOut(authorization: string): Promise<void> {
        await this._blacklist.add(authorization);
    }

    async renew(refreshToken: string): Promise<string> {
        return pipe(
            await this._jwtService.verify(refreshToken),
            userInfo => this._jwtService.signAccess(userInfo)
        );
    }
}
