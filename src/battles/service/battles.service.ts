import { Inject, Injectable, Logger } from "@nestjs/common";
import { PlayersService } from "../../players";
import { PlayerItemsService, PlayerSkillsService } from "../../inventory";
import { MonstersService, RegionsService } from "../../game";

@Injectable()
export class BattlesService {
    private readonly _logger: Logger = new Logger(BattlesService.name);

    constructor(
       @Inject(PlayersService)
       private readonly _playersService: PlayersService,
       @Inject(PlayerItemsService)
       private readonly _playerItemsService: PlayerItemsService,
       @Inject(PlayerSkillsService)
       private readonly _playerSkillsService: PlayerSkillsService,
       @Inject(RegionsService)
       private readonly _regionsService: RegionsService,
       @Inject(MonstersService)
       private readonly _monstersService: MonstersService

    ) {}

    async createBattle(playerId: number): Promise<void> {

    }
}