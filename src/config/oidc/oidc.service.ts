import { Inject, Injectable, Logger } from "@nestjs/common";
import { IdTokenParser, IdTokenPayloadVerifier } from "./id-token";
import { IdTokenPayload } from "./dto";
//import { JwksStorage } from "./jwks";

@Injectable()
export class OidcService {
    private readonly _logger: Logger = new Logger(OidcService.name);

    constructor(
        @Inject(IdTokenParser)
        private readonly _idTokenParser: IdTokenParser,
        //@Inject(JwksStorage)
        //private readonly _jwksStorage: JwksStorage,
        @Inject(IdTokenPayloadVerifier)
        private readonly _payloadVerifier: IdTokenPayloadVerifier,
        //@Inject(IdTokenSignatureVerifier)
        //private readonly _signatureVerifier: IdTokenSignatureVerifier
    ) {}

    async verifyIdToken(idToken: string): Promise<IdTokenPayload> {
        const [{ kid }, payload, signature] = this._idTokenParser.parseIdToken(idToken);
        //const jwk = this._jwksStorage.getJwk(kid);

        this._payloadVerifier.verifyPayload(payload);
        //await this._signatureVerifier.verifySignature(signature, jwk);

        return payload;
    }
}