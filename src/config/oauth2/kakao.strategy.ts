import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { loadStrategyOptions } from "./options";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, "kakao") {
    constructor(
        @Inject(ConfigService) config: ConfigService
    ) { super(loadStrategyOptions(config, "kakao")); }

    async validate(
        a: string, r: string,
        profile: Profile,
        done: Function
    ): Promise<void> {
        const { id, provider, displayName: name } = profile;
        const openId = `${provider}-${id}`;
        done(null, { openId, name });
    }
}