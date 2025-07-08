import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Logger } from "@nestjs/common";
import { UserLevelUpEvent } from "./event";
import { UpdateStateCommand } from "./update.state.command";
import { StatesService } from "./states.service";
import { EventEmitter2 } from "@nestjs/event-emitter";

@CommandHandler(UpdateStateCommand)
export class UpdateStateHandler implements ICommandHandler<UpdateStateCommand> {
    private readonly _logger: Logger = new Logger(UpdateStateHandler.name);

    constructor(
        @Inject(StatesService)
        private readonly _statesService: StatesService,
        @Inject(EventBus)
        private readonly _eventBus: EventBus<UserLevelUpEvent>,
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2
    ) {
    }

    async execute(cmd: UpdateStateCommand): Promise<void> {
        await this._statesService.updateState(cmd)
            .then(result => {
                const { levelUp, level, newSkills } = result;

                levelUp && this._eventEmitter.emit(
                    `user.${cmd.id}.event`,
                    new UserLevelUpEvent(cmd.id, level, newSkills)
                )
            })
            .catch(err => {
                this._logger.error(err);
            });
    }

}