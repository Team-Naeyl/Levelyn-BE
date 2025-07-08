import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UpdateWalletCommand } from "../command";
import { Inject, Logger } from "@nestjs/common";
import { WalletsService } from "../service/wallets.service";
import { WalletUpdatedEvent } from "../event";

@CommandHandler(UpdateWalletCommand)
export class UpdateWalletHandler implements ICommandHandler<UpdateWalletCommand> {
    private readonly _logger: Logger = new Logger(UpdateWalletHandler.name);

    constructor(
       @Inject(WalletsService)
       private readonly _walletsService: WalletsService,
       @Inject(EventBus)
       private readonly _eventBus: EventBus<WalletUpdatedEvent>
    ) {}

    async execute(cmd: UpdateWalletCommand): Promise<void> {
        await this._walletsService.updateCoin(cmd)
            .then(coin => {

            })
            .catch(err => this._logger.error(err));
    }

}