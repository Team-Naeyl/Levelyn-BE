import { Inject, Injectable, Logger } from "@nestjs/common";
import { IdTokenPayload, PayloadOptions } from "../dto";
import { PAYLOAD_OPTIONS } from "../options";

@Injectable()
export class IdTokenPayloadVerifier {
    private _logger: Logger = new Logger(IdTokenPayloadVerifier.name);

    constructor(
        @Inject(PAYLOAD_OPTIONS)
        private readonly _options: PayloadOptions
    ) {}

    verifyPayload(payload: IdTokenPayload) {

        if (Object.entries(this._options).some(([k, v]) => payload[k] !== v )) {
            throw new Error(`
                Invalid payload 
                payload: ${JSON.stringify(payload)},
                options: ${JSON.stringify(this._options)}
            `);
        }

        if (payload.exp <= Date.now())
            throw new Error(`Expired token payload: ${JSON.stringify(payload)}`);
    }
}