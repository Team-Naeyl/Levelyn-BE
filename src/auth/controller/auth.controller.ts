import { Controller, ForbiddenException, Get, Inject, Logger, Res, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from "../service";
import { JWT_REFRESH_EXPIRES } from "../token"
import { Cookies, User } from "../../common";
import { SignInDTO, SignInQuery, SignInResponse } from "../dto";
import { Response } from "express";
import { KakaoOAuth2Guard } from "../../config/oauth2";
import { ApiBearerAuth, ApiForbiddenResponse, ApiOAuth2, ApiOperation, ApiOkResponse, ApiTags, ApiQuery } from "@nestjs/swagger";

@Controller('/api/auth')
@ApiTags("Auth")
export class AuthController {
    private readonly _logger: Logger = new Logger(AuthController.name);

    constructor(
        @Inject(AuthService)
        private readonly _authService: AuthService,
        @Inject(JWT_REFRESH_EXPIRES)
        private readonly _refreshExpires: number
    ) {}

    @Get("/sign-in")
    @ApiOperation({ summary: "로그인/회원가입" })
    @ApiOAuth2(["email", "nickname"])
    @ApiQuery({ type: SignInQuery, required: true })
    @ApiOkResponse({ type: SignInResponse })
    @ApiForbiddenResponse({ description: "카카오 인증 실패"})
    @UseGuards(KakaoOAuth2Guard)
    async signIn(
        @User() dto: SignInDTO,
        @Res({ passthrough: true }) res: Response
    ): Promise<SignInResponse> {
        const { accessToken, refreshToken, state, wallet } = await this._authService.signIn(dto);

        res.cookie(
            "REFRESH_TOKEN", refreshToken,
            { httpOnly: true, maxAge: this._refreshExpires, secure: true, sameSite: true }
        );

        return { accessToken, player: state, wallet };
    }

    @Get("/sign-out")
    @ApiOperation({ summary: "로그아웃" })
    @ApiBearerAuth()
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
    @ApiOperation({ summary: "액세스 토큰 재발급" })
    @ApiForbiddenResponse({ description: "리프래시 토큰 만료, 로그인 필요" })
    async renew(
        @Cookies("REFRESH_TOKEN")
        refreshToken: string | undefined
    ) {
        if (!refreshToken) throw new ForbiddenException();
        const accessToken = await this._authService.renew(refreshToken);
        return { accessToken };
    }
}
