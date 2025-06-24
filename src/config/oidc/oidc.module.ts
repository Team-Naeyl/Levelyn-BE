import { Module } from "@nestjs/common";
import { OidcStrategy } from "./oidc.strategy";
import { OidcService } from "./oidc.service";
import { IdTokenParser, IdTokenPayloadVerifier } from "./id-token";
import { JwksLoader, JwksStorage } from "./jwks";
import { OPEN_KEY_URL, OpenKeyURLProvider, PAYLOAD_OPTIONS, PayloadOptionsProvider, STRATEGY_OPTIONS, StrategyOptionsProvider } from "./options";

@Module({
   providers: [
       OidcStrategy,
       OidcService,
       IdTokenParser,
       IdTokenPayloadVerifier,
       //IdTokenSignatureVerifier,
       JwksStorage,
       JwksLoader,
       StrategyOptionsProvider,
       PayloadOptionsProvider,
       OpenKeyURLProvider
   ],
    exports: [
        OidcStrategy,
        OidcService,
        IdTokenParser,
        IdTokenPayloadVerifier,
        //IdTokenSignatureVerifier,
        JwksStorage,
        JwksLoader,
        STRATEGY_OPTIONS,
        PAYLOAD_OPTIONS,
        OPEN_KEY_URL
    ]
})
export class OidcModule {}