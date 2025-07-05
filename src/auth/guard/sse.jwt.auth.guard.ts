import { ExecutionContext, Inject, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BlacklistService } from "../service";

@Injectable()
export class SseJwtAuthGuard extends AuthGuard("jwt") {
    private readonly _logger: Logger = new Logger(SseJwtAuthGuard.name);

    constructor(
        @Inject(BlacklistService)
        private readonly _blacklist: BlacklistService
    ) { super(); }

    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const token: string | undefined = ctx.switchToHttp().getRequest().query?.token;
        this._logger.debug({ token });

        if (token && await this._blacklist.exists(`Bearer ${token}`))
            return false;

        return await (super.canActivate(ctx) as Promise<boolean>);
    }
}