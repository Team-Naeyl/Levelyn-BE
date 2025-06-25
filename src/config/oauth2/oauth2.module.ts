import { Module } from "@nestjs/common";
import { KakaoStrategy } from "./kakao.strategy";

@Module({
    providers: [KakaoStrategy],
    exports: [KakaoStrategy]
})
export class OAuth2Module {}