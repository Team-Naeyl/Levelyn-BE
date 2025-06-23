import { Inject, Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { UserStatesService } from "./service";
import { FulfillToDoEvent } from "../to-do/dto";

@Injectable()
export class StatesListener {
    private readonly _logger: Logger = new Logger(StatesListener.name);

    constructor(
        @Inject(UserStatesService)
        private readonly _userStatesService: UserStatesService
    ) {}

    @OnEvent("fulfill.to-do")
    async onFulfillToDo(msg: FulfillToDoEvent): Promise<void> {
        const { stateId: id, userId, exp: deltaExp } = msg;

        await this._userStatesService
            .updateState({ id, userId, deltaExp, deltaPosition: 1 })
            .catch(err => this._logger.error(err));
    }
}