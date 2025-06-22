import { Inject, Injectable, Logger } from "@nestjs/common";
import { FulfillToDoResult } from "../dto";
import { IS_BATTLE_EVENT } from "../token";
import { UserInfo } from "../../auth/dto";
import { RewardsService } from "../../game";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class FulfillToDoHandler {
    private readonly _logger: Logger = new Logger(FulfillToDoHandler.name);

    constructor(
        @Inject(IS_BATTLE_EVENT)
        private readonly _isBattle: () => boolean,
        @Inject(RewardsService)
        private readonly _rewardsService: RewardsService,
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2,
    ) {}

    async handle(userInfo: UserInfo): Promise<FulfillToDoResult> {
        const { id: userId, stateId, walletId } = userInfo;

        const isBattle = this._isBattle();
        const reward = await this._rewardsService.getReward(isBattle ? "battle" : "tile");
        const sessionId = isBattle ? "session" : null;

        this._eventEmitter.emit("fulfill.to-do.event", {
            userId, stateId, walletId,
            ...reward, sessionId
        });

        return { isBattle, sessionId, reward };
    }
}