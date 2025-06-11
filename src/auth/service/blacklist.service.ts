import { Inject, Injectable, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { JWT_ACCESS_EXPIRES } from "../../config/jwt";

@Injectable()
export class BlacklistService {
    private readonly _logger: Logger = new Logger(BlacklistService.name);

    constructor(
        @Inject(Redis)
        private readonly _redis: Redis,
        @Inject(JWT_ACCESS_EXPIRES)
        private readonly _expires: number
    ) {}

    async add(authorization: string): Promise<void> {
        await this._redis.set(
            authorization,
            new Date().toLocaleDateString(),
            "PX",
            this._expires
        );
    }

    async exists(authorization: string): Promise<boolean> {
        return !!await this._redis.get(authorization);
    }
}