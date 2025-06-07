import { OptionsProvider } from "../../../common";
import { StrategyOptions } from "passport-openidconnect";


export const STRATEGY_OPTIONS = Symbol('STRATEGY_OPTIONS');

export const StrategyOptionsProvider = OptionsProvider<StrategyOptions>(
    STRATEGY_OPTIONS,
    config => ({
        issuer: config.get<string>("OIDC_ISSUER")!,
        authorizationURL: config.get<string>("OIDC_AUTHORIZATION_URL")!,
        tokenURL: config.get<string>("OIDC_TOKEN_URL")!,
        userInfoURL: config.get<string>("OIDC_USER_INFO_URL")!,
        clientID: config.get<string>("OIDC_CLIENT_ID")!,
        clientSecret: config.get<string>("OIDC_CLIENT_SECRET")!,
        callbackURL: config.get<string>("OIDC_CALLBACK_URL")!,
        nonce: config.get<string>("OIDC_NONCE")!
    })
)