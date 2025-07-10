import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateBattleService } from "./create-battle";
import { Battle, Player } from "../schema";
import { BattleDTO, ExecuteBattleResult, CreateBattleDTO, PlayerDTO } from "../dto";
import { ExecuteBattleService } from "./execute-battle";
import { from, Observable, tap } from "rxjs";

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
       const battle = await this._createBattleService.createBattle(dto);
       return __toDTO(battle);
    }

    executeBattle(id: string): Observable<ExecuteBattleResult> {
         return from(this._executeBattleService.executeBattle(id))
             .pipe(tap(msg => this._logger.debug(msg)));
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
