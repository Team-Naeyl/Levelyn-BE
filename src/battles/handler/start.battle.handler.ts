import { Inject, Injectable } from "@nestjs/common";
import { BattlesStorage } from "../battles.storage";
import { BattleDTO, StartBattleResult, PlayerDTO } from "../dto";
import { Battle } from "../schema";

@Injectable()
export class StartBattleHandler {

    constructor(
        @Inject(BattlesStorage)
        private readonly _battlesStorage: BattlesStorage
    ) {}

    async getBattle(id: string): Promise<StartBattleResult> {
        const battle = await this._battlesStorage.getBattle(id)
            .then(battle => battle && __toDTO(battle))
            .catch(err => { throw err; });

        return { prepared: !!battle, battle };
    }


}

function __toDTO(battle: Battle): BattleDTO {
    const { id, regionId, monsters } = battle;

    const player: PlayerDTO = {
        ...battle.player.stat,
        skills: battle.player.skills.map(sk => ({
            id: sk.id,
            name: sk.name,
            description: sk.description
        }))
    };

    return { id, regionId, player, monsters };
}