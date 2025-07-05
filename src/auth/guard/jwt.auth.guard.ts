import { ExecutionContext, Inject, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BlacklistService } from "../service";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    private readonly _logger: Logger = new Logger(JwtAuthGuard.name);

    constructor(
        @Inject(BlacklistService)
        private readonly _blacklist: BlacklistService
    ) { super(); }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {

        const { authorization } = ctx.switchToHttp().getRequest<Request>().headers;
        this._logger.debug(authorization);

        if (authorization && await this._blacklist.exists(authorization))
            return false;

        return await (super.canActivate(ctx) as Promise<boolean>);
    }

}