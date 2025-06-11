import { Controller, ForbiddenException, Get, Inject, Logger, Res, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from "../service/auth.service";
import { JWT_REFRESH_EXPIRES } from "../../config/jwt";
import { Cookies, User } from "../../common";
import { SignInDTO } from "../dto";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller('/api/auth')
export class AuthController {
    private readonly _logger: Logger = new Logger(AuthController.name);

    constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
        @Inject(JWT_REFRESH_EXPIRES)
        private readonly _refreshExpires: number
    ) {}

    @Get("/sign-in")
    @UseGuards(AuthGuard("oidc"))
    async signIn(
        @User() dto: SignInDTO,
        @Res({ passthrough: true }) res: Response
    ) {
        const { refreshToken, ...rest } = await this._authService.signIn(dto);

        res.cookie(
            "REFRESH_TOKEN",
            refreshToken,
            { httpOnly: true, maxAge: this._refreshExpires }
        );

        return rest;
    }

    @Get("/sign-out")
    async signOut(
        @Headers("authorization")
        authorization: string,
        @Res({ passthrough: true })
        res: Response
    ) {
        authorization && await this._authService.signOut(authorization);
        res.clearCookie("REFRESH_TOKEN");
    }

    @Get("/renew")
    async renew(
        @Cookies("REFRESH_TOKEN")
        refreshToken: string | undefined
    ) {
        if (!refreshToken) throw new ForbiddenException();
        const accessToken = await this._authService.renew(refreshToken);
        return { accessToken };
    }
}
