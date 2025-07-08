import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RewardUserCommand } from "./command";
import { Inject, Logger } from "@nestjs/common";
import { RewardsService } from "./service";
import { UserRewardedEvent } from "./event";
import { EventEmitter2 } from "@nestjs/event-emitter";

@CommandHandler(RewardUserCommand)
export class RewardUserHandler implements ICommandHandler<RewardUserCommand> {
    private readonly _logger: Logger = new Logger(RewardUserHandler.name);

    constructor(
       @Inject(RewardsService)
       private readonly _rewardsService: RewardsService,
       @Inject(EventEmitter2)
       private readonly _eventEmitter: EventEmitter2
    ) {}

    async execute(cmd: RewardUserCommand): Promise<void> {
        await this._rewardsService.rewardUser(cmd)
            .then(result => {
                this._eventEmitter.emit(
                    "user.event",
                    new UserRewardedEvent(cmd.userId, result)
                );
            })
            .catch(err => {
                this._logger.error(err);
            })
    }
}