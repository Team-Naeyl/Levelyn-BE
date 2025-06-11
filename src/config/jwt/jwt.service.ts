import jwt from 'jsonwebtoken';
import { randomBytes } from "node:crypto";
import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JWT_ACCESS_EXPIRES, JWT_REFRESH_EXPIRES, JWT_SECRET } from "./jwt.options.tokens";
import { TokenPayload, UserInfo } from "./dto";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";

@Injectable()
export class JwtService {
    private readonly _logger: Logger = new Logger(JwtService.name);

    constructor(
        @Inject(JWT_SECRET)
        private readonly _secret: string,
        @Inject(JWT_ACCESS_EXPIRES)
        private readonly _accessExpires: number,
        @Inject(JWT_REFRESH_EXPIRES)
        private readonly _refreshExpires: number,
    ) {}

    signAccess(userInfo: UserInfo) {
        return this.sign(userInfo, this._accessExpires);
    }

    signRefresh(userInfo: UserInfo) {
        return this.sign(userInfo, this._refreshExpires);
    }

    async verify(token: string) {

        try {

            const payload = plainToInstance(
                TokenPayload,
                jwt.verify(token, this._secret)
            );

            await validateOrReject(payload);
            return payload;
        }
        catch (error) {
            this._logger.error(error);
            throw new UnauthorizedException();
        }

    }


    private sign(userInfo: UserInfo, expiresIn: number) {
        return jwt.sign(
            {  ...userInfo, salt: randomBytes(32).toString("base64") },
            this._secret, { expiresIn });
    }
}