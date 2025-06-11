import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Jwk } from "../dto";
import { jwtVerify } from "jose";

@Injectable()
export class IdTokenSignatureVerifier {
    private readonly _logger: Logger = new Logger(IdTokenSignatureVerifier.name);

    async verifySignature(signature: string, jwk: Jwk): Promise<void> {
        await jwtVerify(signature, jwk, { algorithms: [jwk.alg] })
            .catch(err => {
                this._logger.error(err);
                throw new UnauthorizedException();
            });
    }
}