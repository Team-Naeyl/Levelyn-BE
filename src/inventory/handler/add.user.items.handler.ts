import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddUserItemsCommand } from "../command";
import { Inject, Logger } from "@nestjs/common";
import { UserItemsService } from "../service";
import { UserItemDTO } from "../dto";

@CommandHandler(AddUserItemsCommand)
export class AddUserItemsHandler implements ICommandHandler<AddUserItemsCommand> {
    private readonly _logger: Logger = new Logger(AddUserItemsHandler.name);

    constructor(
        @Inject(UserItemsService)
        private readonly _userItemsService: UserItemsService,
    ) {}

    async execute(cmd: AddUserItemsCommand): Promise<UserItemDTO[]> {
        return await this._userItemsService.addUserItems(cmd);
    }

}