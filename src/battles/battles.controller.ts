import { Controller, Inject, Param, Sse } from "@nestjs/common";
import { BattlesService } from "./service";
import { from } from "rxjs";
import { ApiNotFoundResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Battles")
@Controller("/api/battles")
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
        return from(this._battleService.executeBattle(id));
    }

}