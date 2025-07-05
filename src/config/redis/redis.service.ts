import Redis, { RedisOptions } from "ioredis";

export class RedisService extends Redis {
    constructor(options: RedisOptions) {
        super(options);
    }


}

