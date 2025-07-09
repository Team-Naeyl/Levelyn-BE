import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateBattleCommand } from "../command";
import { BattlesService,  } from "../service";
import { Inject, Logger } from "@nestjs/common";
import { UserEvent } from "../../common";

@CommandHandler(CreateBattleCommand)
export class CreateBattleHandler implements ICommandHandler<CreateBattleCommand> {
    private readonly _logger: Logger = new Logger(CreateBattleHandler.name);

    constructor(
       @Inject(BattlesService)
       private readonly _battlesService: BattlesService,
       @Inject(EventBus)
       private readonly _eventBus: EventBus,
    ) {}

    async execute(cmd: CreateBattleCommand): Promise<any> {
        await this._battlesService.createBattle(cmd)
            .then(battle =>
                this._eventBus.publish(
                    new UserEvent(cmd.userId, "BATTLE", battle)
                )
            )
            .catch(err => this._logger.error(err));
    }

}