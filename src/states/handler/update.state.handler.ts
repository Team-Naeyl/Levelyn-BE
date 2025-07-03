import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UpdateStateCommand } from "../command";
import { Inject, Logger } from "@nestjs/common";
import { StatesService } from "../service";
import { LevelUpEvent } from "../event";

@CommandHandler(UpdateStateCommand)
export class UpdateStateHandler implements ICommandHandler<UpdateStateCommand> {
    private readonly _logger: Logger = new Logger(UpdateStateHandler.name);

    constructor(
        @Inject(StatesService)
        private readonly _statesService: StatesService,
        @Inject(EventBus)
        private readonly _eventBus: EventBus<LevelUpEvent>,
    ) {
    }

    async execute(cmd: UpdateStateCommand): Promise<void> {
        await this._statesService.updateState(cmd)
            .then(result => {
                this._logger.log(result);

                result.levelUp && this._eventBus.publish(
                    new LevelUpEvent(
                        cmd.id, result.level
                    )
                );
            })
            .catch(err => {
                this._logger.error(err);
            })
    }

}