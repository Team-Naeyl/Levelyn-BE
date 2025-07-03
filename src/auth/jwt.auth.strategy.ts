import { Inject, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_SECRET } from "./token";
import { TokenPayload } from "./dto";
import { pick } from "@fxts/core";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, "jwt") {
    private readonly _logger: Logger = new Logger(JwtAuthStrategy.name);

    constructor(
        @Inject(JWT_SECRET) secret: string
    ) {
        super({
            secretOrKey: secret,
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                ExtractJwt.fromUrlQueryParameter("token")
            ])
        });
    }

    async validate(payload: TokenPayload, done: Function): Promise<void> {
        this._logger.debug(payload);
        done(null, pick(["id"], payload));
    }
}