import { Inject, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { OPEN_KEY_URL } from "../options";
import { Jwk, LoadJwksResult } from "../dto";


@Injectable()
export class JwksLoader {
    private readonly _logger: Logger = new Logger(JwksLoader.name);

    constructor(
        @Inject(HttpService)
        private readonly _httpService: HttpService,
        @Inject(OPEN_KEY_URL)
        private readonly _openKeyURL: string
    ) {}

    async loadJwks(): Promise<Jwk[]> {
        return await this._httpService
            .axiosRef
            .get<LoadJwksResult>(this._openKeyURL)
            .then(res => {
                this._logger.log("Jwks loaded successfully");
                return res.data.keys;
            });
    }
}