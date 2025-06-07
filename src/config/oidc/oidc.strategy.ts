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
    ) { super(options); }

    async validate(
        issuer: string,
        profile: any,
        context: any,
        idToken: string,
        done: Function
    ): Promise<void> {
        this._logger.debug(JSON.stringify({ issuer, profile, context }));

        await this._oidcService.verifyIdToken(idToken)
            .then(payload => {
                this._logger.debug(payload);
                done(null, { openId: payload.sub, name: payload.nickname });
            }).catch(err => {
                this._logger.error(err);
                done(err, false);
            });
    }

}