import { Controller, Inject, Param, Sse, UseInterceptors } from "@nestjs/common";
import { BattlesService } from "./service";
import { ApiNotFoundResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { SseInterceptor } from "../common";

@ApiTags("Battles")
@Controller("/api/battles")
@UseInterceptors(SseInterceptor)
export class BattlesController {

    constructor(
       @Inject(BattlesService)
       private readonly _battleService: BattlesService,
    ) {}

    @Sse("/:id")
    @ApiOperation({ summary: "전투 이벤트 스트림" })
    @ApiParam({ name: "id", type: "string", required: true, description: "발급받은 전투 세션 아이디" })
    @ApiNotFoundResponse({ description: "해당 아이디의 세션이 존재하지 않음" })
    executeBattle(
        @Param("id") id: string
    ) {
        return this._battleService.executeBattle(id);
    }

}