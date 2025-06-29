import { Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { plainToInstance } from "class-transformer";
import { KakaoUserInfo, OAuth2UserInfo } from "./data";
import { pipe, tap } from "@fxts/core";
import { validateOrReject } from "class-validator";

@Injectable()
export class KakaoOAuth2Service {
    private readonly _logger: Logger = new Logger(KakaoOAuth2Service.name);

    constructor(
        @Inject(HttpService)
        private readonly _httpService: HttpService
    ) {}

    async loadUserInfo(token: string): Promise<OAuth2UserInfo> {

        const { id, kakaoAccount: { email, profile: { nickname: name } } } = pipe(
            await this.sendRequest(token),
            data => plainToInstance(KakaoUserInfo, data),
            tap(async userInfo => await validateOrReject(userInfo)),
        );

        const openId = `kakao-${id}`;
        return { openId, name, email };
    }

    private async sendRequest(token: string): Promise<any> {

        const { data } = await this._httpService.axiosRef.get(
            "https://kapi.kakao.com/v2/user/me",
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type":  "application/x-www-form-urlencoded;charset=UTF-8"
                },
                params: {
                   property_keys: JSON.stringify(["kakao_account.email","kakao_account.profile"])
                }
            }
        );

        return data;
    }
}