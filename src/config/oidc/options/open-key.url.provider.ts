import { OptionsProvider } from "../../../common";

export const OPEN_KEY_URL = Symbol('OPEN_KEY_URL');

export const OpenKeyURLProvider = OptionsProvider(
    OPEN_KEY_URL,
    config => config.get<string>("OIDC_OPEN_KEY_URL")!
);