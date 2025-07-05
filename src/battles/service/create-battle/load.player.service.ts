import { Inject, Injectable } from "@nestjs/common";
import { StatesService } from "../../../states";
import { UserSkillsService } from "../../../inventory";
import { Player, PlayerSkill, PlayerStat } from "../../schema";

@Injectable()
export class LoadPlayerService {

    constructor(
       @Inject(StatesService)
       private readonly _statesService: StatesService,
       @Inject(UserSkillsService)
       private readonly _userSkillsService: UserSkillsService,
    ) {}

    async loadPlayer(userId: number): Promise<Player> {
        const { attack, will, ...rest } = await this._statesService.getState(userId);
        const stat: PlayerStat = { attack, will };
        const skills: PlayerSkill[] = await this._userSkillsService.getEquippedSkills(userId);
        return new Player({ ...rest, stat, skills });
    }
}