import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateBattleCommand } from "../command";
import { BattlesService,  } from "../service";
import { Inject, Logger } from "@nestjs/common";
import { BattleCreatedEvent } from "../event";
import { EventEmitter2 } from "@nestjs/event-emitter";

@CommandHandler(CreateBattleCommand)
export class CreateBattleHandler implements ICommandHandler<CreateBattleCommand> {
    private readonly _logger: Logger = new Logger(CreateBattleHandler.name);

    constructor(
       @Inject(BattlesService)
       private readonly _battlesService: BattlesService,
       @Inject(EventEmitter2)
       private readonly _eventEmitter: EventEmitter2
    ) {}

    async execute(cmd: CreateBattleCommand): Promise<any> {
        await this._battlesService.createBattle(cmd)
            .then(battle =>
                this._eventEmitter.emit(
                    "user.event",
                    new BattleCreatedEvent(cmd.userId, battle)
                )
            )
            .catch(err => this._logger.error(err));
    }

}