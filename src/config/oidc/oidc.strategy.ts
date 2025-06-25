import { Inject, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, StrategyOptions } from "passport-openidconnect";
import { OidcService } from "./oidc.service";
import { STRATEGY_OPTIONS } from "./options";

@Injectable()
export class OidcStrategy extends PassportStrategy(Strategy, "oidc") {
    private readonly _logger: Logger = new Logger(OidcStrategy.name);

    constructor(
        @Inject(OidcService)
        private readonly _oidcService: OidcService,
        @Inject(STRATEGY_OPTIONS)
        options: StrategyOptions
    ) { super({ ...options, scope: ["account_email", "profile_nickname"] }); }

    async validate(
        issuer: string,
        profile: any,
        done: Function
    ): Promise<void> {
        this._logger.debug(profile);
        const { id: openId } = profile;
        done(null, { openId });
    }

}