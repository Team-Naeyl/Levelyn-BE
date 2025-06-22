import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserItemsService } from "./service";
import { OnEvent } from "@nestjs/event-emitter";
import { FulfillToDoEvent } from "../to-do/dto";

@Injectable()
export class InventoryListener {
    private readonly _logger: Logger = new Logger(InventoryListener.name);

    constructor(
        @Inject(UserItemsService)
        private readonly _userItemsService: UserItemsService
    ) {}

    @OnEvent("fulfill.to-do")
    async onFulfillToDo(msg: FulfillToDoEvent): Promise<void> {
        const { userId, itemId } = msg;

        itemId && await this._userItemsService.addUserItems({
            userId,
            itemIds: [itemId]
        }).catch(err => this._logger.error(err));
    }
}