import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { AddUserItemsCommand } from "../command";
import { Inject, Logger } from "@nestjs/common";
import { UserItemsService } from "../service";
import { UserItemsAddedEvent } from "../event";

@CommandHandler(AddUserItemsCommand)
export class AddUserItemsHandler implements ICommandHandler<AddUserItemsCommand> {
    private readonly _logger: Logger = new Logger(AddUserItemsHandler.name);

    constructor(
        @Inject(UserItemsService)
        private readonly _userItemsService: UserItemsService,
        @Inject(EventBus)
        private readonly _eventBus: EventBus,
    ) {}

    async execute(cmd: AddUserItemsCommand): Promise<void> {
        await this._userItemsService.addUserItems(cmd)
            .then(items => {
                items.length && this._eventBus.publish(
                    new UserItemsAddedEvent(
                        cmd.userId,
                        items
                    )
                )
            })
            .catch(err => {
                this._logger.error(err);
            });
    }

}