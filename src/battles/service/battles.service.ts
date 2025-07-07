import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateBattleService } from "./create-battle";
import { Battle, Player } from "../schema";
import { BattleDTO, ExecuteBattleResult, CreateBattleDTO, PlayerDTO } from "../dto";
import { ExecuteBattleService } from "./execute-battle";
import { pipe, tap } from "@fxts/core";

@Injectable()
export class BattlesService {
    private readonly _logger: Logger = new Logger(BattlesService.name);

    constructor(
       @Inject(CreateBattleService)
       private readonly _createBattleService: CreateBattleService,
       @Inject(ExecuteBattleService)
       private readonly _executeBattleService: ExecuteBattleService,
    ) {}

    async createBattle(dto: CreateBattleDTO): Promise<BattleDTO> {
        return pipe(
            await this._createBattleService.createBattle(dto),
            tap(battle => this._logger.log(JSON.stringify(battle))),
            __toDTO
        );
    }

    async* executeBattle(id: string): AsyncIterableIterator<ExecuteBattleResult> {
        yield* this._executeBattleService.executeBattle(id);
    }
}



function __toDTO(battle: Battle): BattleDTO {
    const { id, player, mob } = battle;
    return { id, mob, player: __toPlayerDTO(player) };
}

function __toPlayerDTO(player: Player): PlayerDTO {
    const { level, exp, stat: { attack, will }, skills } = player;

    return {
        level, exp, attack, will,
        skills: skills.map((skill, idx) => {
            const { id, name, description } = skill;
            return { id, name, description, active: !idx };
        })
    };
}
