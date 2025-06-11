import { Injectable, Logger } from "@nestjs/common";
import { IdTokenHeader, IdTokenPayload } from "../dto";
import { Buffer } from "node:buffer";

@Injectable()
export class IdTokenParser {
    private readonly _logger: Logger = new Logger(IdTokenParser.name);

    parseIdToken(idToken: string): [IdTokenHeader, IdTokenPayload, string] {
        const raws = idToken.split('.');
        if (raws.length !== 3) throw Error(`Invalid id token: ${idToken}`);

        try {
            return raws.slice(0, 2)
                .map(s => Buffer.from(s, "base64").toString("utf8"))
                .map(s => JSON.parse(s))
                .concat(raws.slice(2)) as [IdTokenHeader, IdTokenPayload, string];
        }
        catch (error) {
            this._logger.error(error);
            throw Error(`Invalid id token: ${idToken}`);
        }
    }
}