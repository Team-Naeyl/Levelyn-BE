import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateBattleCommand } from "../command";
import { BattlesService,  } from "../service";
import { Inject, Logger } from "@nestjs/common";
import { BattleCreatedEvent } from "../event";

@CommandHandler(CreateBattleCommand)
export class CreateBattleHandler implements ICommandHandler<CreateBattleCommand> {
    private readonly _logger: Logger = new Logger(CreateBattleHandler.name);

    constructor(
       @Inject(BattlesService)
       private readonly _battlesService: BattlesService,
       @Inject(EventBus)
       private readonly _eventBus: EventBus
    ) {}

    async execute(cmd: CreateBattleCommand): Promise<any> {
        await this._battlesService.createBattle(cmd)
            .then(battleId =>
                this._eventBus.publish(new BattleCreatedEvent(cmd.userId, battleId))
            )
            .catch(err => this._logger.error(err));
    }

}