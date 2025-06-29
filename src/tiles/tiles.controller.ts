import { Controller, Get, Inject, Logger, UseGuards } from '@nestjs/common';
import { TilesService } from "./tiles.service";
import { JwtAuthGuard } from "../auth";
import { User } from "../common";

@Controller('/api/tiles')
@UseGuards(JwtAuthGuard)
export class TilesController {
    private readonly _logger: Logger = new Logger(TilesController.name);

    constructor(
        @Inject(TilesService)
        private readonly _tilesService: TilesService
    ) {}


    @Get("/reward")
    async reward(@User("id") userId: number) {
        const result = await this._tilesService.makeTileReward(userId);
        this._logger.log(result);
        return result;
    }

}
