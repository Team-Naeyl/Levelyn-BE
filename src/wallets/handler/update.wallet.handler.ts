import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateWalletCommand } from "../command";
import { Inject, Logger } from "@nestjs/common";
import { WalletsService } from "../service";

@CommandHandler(UpdateWalletCommand)
export class UpdateWalletHandler implements ICommandHandler<UpdateWalletCommand> {
    private readonly _logger: Logger = new Logger(UpdateWalletHandler.name);

    constructor(
       @Inject(WalletsService)
       private readonly _walletsService: WalletsService,
    ) {}

    async execute(cmd: UpdateWalletCommand): Promise<void> {
        await this._walletsService.updateCoin(cmd)
            .catch(err => this._logger.error(err));
    }

}