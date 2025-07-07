import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SetPenaltyCommand } from "./set.penalty.command";
import { Inject, Logger } from "@nestjs/common";
import { TilesService } from "./tiles.service";

@CommandHandler(SetPenaltyCommand)
export class SetPenaltyHandler implements ICommandHandler<SetPenaltyCommand> {
    private readonly _logger: Logger = new Logger(SetPenaltyHandler.name);

    constructor(
       @Inject(TilesService)
       private readonly _tilesService: TilesService,
    ) {}

    async execute(cmd: SetPenaltyCommand): Promise<any> {
        await this._tilesService.setPenalty(cmd)
            .catch(err => this._logger.error(err));
    }

}