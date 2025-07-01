import { Controller, Inject, Sse, UseGuards } from '@nestjs/common';
import { StatesService } from "./service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtAuthGuard } from "../auth";
import { SseQuerySchema, User } from "../common";
import { from, fromEvent, map, mergeMap, Observable } from "rxjs";
import { StateUpdatedNotification } from "./dto";
import { UserRewardedEvent } from "../rewards/event";
import { ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";

@Controller('/api/states')
@UseGuards(JwtAuthGuard)
export class StatesController {

    constructor(
        @Inject(StatesService)
        private readonly _statesService: StatesService,
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2
    ) {}

    @Sse("/notification")
    @ApiOperation({ summary: "스탯 & 경험치 업데이트 됨을 알림" })
    @ApiQuery({ type: SseQuerySchema, required: true })
    @ApiOkResponse({ type: StateUpdatedNotification })
    notifyStateUpdated(@User("id") userId: number): Observable<StateUpdatedNotification> {
        return fromEvent(this._eventEmitter, `user.${userId}.rewarded`)
            .pipe(
                map(msg => msg as UserRewardedEvent),
                mergeMap(({ userId: id, exp: deltaExp }) =>
                    from(this._statesService.updateState({ id, deltaExp, deltaPosition: 1 }))
                )
            );
    }
}
