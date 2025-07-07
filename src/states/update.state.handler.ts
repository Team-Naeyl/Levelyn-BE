import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { UserLevelUpEvent } from "./event";
import { UpdateStateCommand } from "./update.state.command";
import { StatesService } from "./states.service";

@CommandHandler(UpdateStateCommand)
export class UpdateStateHandler implements ICommandHandler<UpdateStateCommand> {
    private readonly _logger: Logger = new Logger(UpdateStateHandler.name);

    constructor(
        @Inject(StatesService)
        private readonly _statesService: StatesService,
        @Inject(EventBus)
        private readonly _eventBus: EventBus<UserLevelUpEvent>,
    ) {
    }

    async execute(cmd: UpdateStateCommand): Promise<void> {
        await this._statesService.updateState(cmd)
            .then(result => {
                const { levelUp, level, newSkills } = result;

                levelUp && this._eventBus.publish(
                    new UserLevelUpEvent(cmd.id, level, newSkills)
                );
            })
            .catch(err => {
                this._logger.error(err);
            });
    }

}