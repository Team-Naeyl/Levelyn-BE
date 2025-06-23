import { Inject, Injectable, Logger } from "@nestjs/common";
import { JWT_ACCESS_EXPIRES } from "../token";
import * as NodeCache from "node-cache";

@Injectable()
export class BlacklistService {
    private readonly _logger: Logger = new Logger(BlacklistService.name);
    private readonly _list: NodeCache = new NodeCache();

    constructor(
        @Inject(JWT_ACCESS_EXPIRES)
        private readonly _expires: number
    ) {}

    async add(authorization: string): Promise<void> {
        this._list.set(
            authorization,
            new Date().toLocaleDateString(),
            this._expires
        );
    }

    async exists(authorization: string): Promise<boolean> {
        return this._list.has(authorization);
    }
}