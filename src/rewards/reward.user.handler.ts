import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { RewardUserCommand } from "./command";
import { Inject, Logger } from "@nestjs/common";
import { RewardsService } from "./service";
import { UserRewardedEvent } from "./event";

@CommandHandler(RewardUserCommand)
export class RewardUserHandler implements ICommandHandler<RewardUserCommand> {
    private readonly _logger: Logger = new Logger(RewardUserHandler.name);

    constructor(
       @Inject(RewardsService)
       private readonly _rewardsService: RewardsService,
       @Inject(EventBus)
       private readonly _eventBus: EventBus,
    ) {}

    async execute(cmd: RewardUserCommand): Promise<void> {
        await this._rewardsService.rewardUser(cmd)
            .then(result => {
                this._logger.log(result);
                this._eventBus.publish(new UserRewardedEvent(cmd.userId, result));
            })
            .catch(err => {
                this._logger.error(err);
            })
    }
}