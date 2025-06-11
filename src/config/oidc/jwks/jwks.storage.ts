import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Jwk } from "../dto";
import { Cron, CronExpression } from "@nestjs/schedule";
import { JwksLoader } from "./jwks.loader";

@Injectable()
export class JwksStorage implements OnModuleInit{
    private readonly _logger: Logger = new Logger(JwksStorage.name);
    private _storage: Map<string, Jwk> = new Map();

    constructor(
        @Inject(JwksLoader)
        private readonly _jwksLoader: JwksLoader
    ) {}

    getJwk(kid: string): Jwk {
        const jwk = this._storage.get(kid);
        if (!jwk) throw new Error(`No such open key of id ${kid}`);
        return jwk;
    }

    async onModuleInit(): Promise<void> {
        await this.updateStorage();
    }

    @Cron(CronExpression.EVERY_2ND_MONTH)
    async onCronEvent(): Promise<void> {
        await this.updateStorage();
    }

    private async updateStorage(): Promise<void> {
        try {
           const jwks = await this._jwksLoader.loadJwks();
           this._storage = new Map(jwks.map(jwk => [jwk.kid, jwk]));
       }
       catch (error) {
           this._logger.error(error);
       }
    }
}

