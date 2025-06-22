import { Inject, Injectable } from "@nestjs/common";
import { UserItemsService, UserSkillsService } from "../../inventory";
import { UserStatesService } from "../../states";
import { BATTLE_COIN_REWARD_PROBABILITY, BATTLE_EXP_REWARD, BATTLE_ITEM_REWARD_PROBABILITY, MonstersService} from "../../game";
import { CreateBattleDTO } from "../dto";
import { Player, BattleRewardSchema } from "../schema";
import { BattlesStorage } from "../battles.storage";

@Injectable()
export class CreateBattleHandler {
    constructor(
        @Inject(UserItemsService)
        private readonly _userItemsService: UserItemsService,
        @Inject(UserSkillsService)
        private readonly _userSkillsService: UserSkillsService,
        @Inject(UserStatesService)
        private readonly _userStatesService: UserStatesService,
        @Inject(MonstersService)
        private readonly _monstersService: MonstersService,
        @Inject(BATTLE_EXP_REWARD)
        private readonly _exp: number,
        @Inject(BATTLE_ITEM_REWARD_PROBABILITY)
        private readonly _pItem: number,
        @Inject(BATTLE_COIN_REWARD_PROBABILITY)
        private readonly _pCoin: number,
        @Inject(BattlesStorage)
        private readonly _battlesStorage: BattlesStorage,
    ) {}

    async createBattle(dto: CreateBattleDTO): Promise<void> {
        const { userId, stateId, sessionId } = dto;
        const { level, attack, will, regionId } = await this._userStatesService.getUserState(stateId);
        const netEffect = await this._userItemsService.getNetEquippedItemEffect(userId);

        const id = sessionId;

        const player: Player = {
            stat: {
                level,
                attack: attack + netEffect.attack,
                will: will + netEffect.will,
            },
            skills: await this._userSkillsService.getEquippedSkills(userId)
        };

        const reward: BattleRewardSchema = {
            exp: this._exp * (1 + netEffect.exp),
            pItem: this._pItem * (1 + netEffect.pItem),
            pCoin: this._pCoin * (1 + netEffect.pCoin)
        };

        const monsters = await this._monstersService.getLocalMonsters(regionId);
        await this._battlesStorage.addBattle({ id, regionId, player, reward, monsters });
    }
}

