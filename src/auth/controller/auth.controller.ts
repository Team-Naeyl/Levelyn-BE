import {
    Controller,
    ForbiddenException,
    Get,
    Inject,
    Logger,
    Res,
    Headers,
    UseGuards,
    Req, Redirect
} from '@nestjs/common';
import { AuthService } from "../service";
import { JWT_REFRESH_EXPIRES } from "../token"
import { Cookies, User } from "../../common";
import { SignInDTO } from "../dto";
import { Request, Response } from "express";
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
    @Redirect()
    @UseGuards(AuthGuard("kakao"))
    async signIn(
        @User() dto: SignInDTO,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, refreshToken } = await this._authService.signIn(dto);
        const remoteIp = req.header["x-forwarded-for"] || req.socket.remoteAddress;

        res.cookie(
            "REFRESH_TOKEN", refreshToken,
            { httpOnly: true, maxAge: this._refreshExpires }
        );

        return { url: `http://${remoteIp}:5173?token=${accessToken}`, status: 200 };
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
