import { Controller, Inject, Logger, Sse, UseGuards } from '@nestjs/common';
import { WalletsService } from "./service/wallets.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtAuthGuard } from "../auth";
import { SseQuerySchema, User } from "../common";
import { fromEvent, Observable, filter, map, mergeMap, from, tap } from "rxjs";
import { CoinEarnedNotification } from "./dto";
import { UserRewardedEvent } from "../rewards/event";
import { ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";

@Controller('/api/wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
    private readonly _logger: Logger = new Logger(WalletsController.name);

    constructor(
        @Inject(WalletsService)
        private readonly _walletsService: WalletsService,
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2
    ) {}

    @Sse("/notification")
    @ApiOperation({ summary: "코인 획득 알림" })
    @ApiQuery({ type: SseQuerySchema, required: true })
    @ApiOkResponse({ type: CoinEarnedNotification })
    notifyCoinEarned(
        @User("id") id: number
    ): Observable<CoinEarnedNotification> {
        return fromEvent(this._eventEmitter, `user.${id}.rewarded`)
            .pipe(
                tap(msg => this._logger.log(msg)),
                map(msg => msg as UserRewardedEvent),
                filter(({ coin }) => !!coin),
                mergeMap(({ coin: deltaCoin }) =>
                    from(this._walletsService.updateCoin({ id, deltaCoin }))
                ),
                tap(result => this._logger.log(result))
            );
    }
}
