import { Controller, Inject, Sse, UseGuards } from '@nestjs/common';
import { TilesService } from "./tiles.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtAuthGuard } from "../auth";
import { SseQuerySchema, User } from "../common";
import { from, fromEvent, map, mergeMap, Observable } from "rxjs";
import { ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { ClearTileResponse } from "./dto";

@Controller('/api/tiles')
export class TilesController {

    constructor(
        @Inject(TilesService)
        private readonly _tilesService: TilesService,
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2
    ) {}

    @Sse("/notification")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: "타일 완료 알림" })
    @ApiQuery({ type: SseQuerySchema, required: true })
    @ApiOkResponse({ type: ClearTileResponse })
    notifyTileEvent(@User("id") userId: number): Observable<ClearTileResponse> {
        return fromEvent(this._eventEmitter, `user.${userId}.to-do-fulfilled`)
            .pipe(
                mergeMap(msg =>
                    from(this._tilesService.clearTile(userId))
                )
            );
    }
}
