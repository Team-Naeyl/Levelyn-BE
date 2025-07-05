import { Inject, Injectable, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { CreateBattleService } from "./create-battle";
import { Battle, Player } from "../schema";
import { BattleDTO, BattleMessage, PlayerDTO } from "../dto";
import { ExecuteBattleService } from "./execute-battle";
import { GetBattleService } from "./get.battle.service";

@Injectable()
export class BattlesService {
    private readonly _logger: Logger = new Logger(BattlesService.name);

    constructor(
       @Inject(CreateBattleService)
       private readonly _createBattleService: CreateBattleService,
       @Inject(GetBattleService)
       private readonly _getBattleService: GetBattleService,
       @Inject(ExecuteBattleService)
       private readonly _executeBattleService: ExecuteBattleService,
       @Inject(Redis)
       private readonly _redis: Redis,
    ) {}

    async createBattle(userId: number): Promise<string> {
        const battle = await this._createBattleService.createBattle(userId);
        this._logger.log(JSON.stringify(battle));
        return battle.id;
    }

    async* executeBattle(id: string): AsyncIterableIterator<BattleMessage> {
        const battle = await this._getBattleService.getBattle(id);

        yield { type: "START", payload: __toDTO(battle) };
        yield* this._executeBattleService.executeBattle(battle);

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
