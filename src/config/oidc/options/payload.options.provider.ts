import { OptionsProvider } from "../../../common";
import { PayloadOptions } from "../dto";

export const PAYLOAD_OPTIONS = Symbol("PAYLOAD_OPTIONS");

export const PayloadOptionsProvider = OptionsProvider<PayloadOptions>(
    PAYLOAD_OPTIONS,
    config => ({
        iss: config.get<string>("OIDC_ISSUER")!,
        aud: config.get<string>("OIDC_AUTHORIZATION_URL")!,
        nonce: config.get<string>("OIDC_NONCE")!,
    })
)