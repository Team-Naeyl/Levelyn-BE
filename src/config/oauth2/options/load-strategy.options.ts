import { StrategyOptions } from "./strategy.options";
import { ConfigService } from "@nestjs/config";

export function loadStrategyOptions(
    config: ConfigService,
    strategyName: string
): StrategyOptions {
    const provider = strategyName.toUpperCase();

    return {
        clientID: config.get<string>(`OAUTH2_${provider}_CLIENT_ID`)!,
        clientSecret: config.get<string>(`OAUTH2_${provider}_CLIENT_SECRET`)!,
        callbackURL: config.get<string>(`OAUTH2_${provider}_CALLBACK_URL`)!,
    };
}