import { Inject, Injectable } from "@nestjs/common";
import { LevelUpDTO } from "../dto";
import { map, pipe, prop, toArray } from "@fxts/core";
import { DELTA_ATTACK_PER_LEVEL_UP, DELTA_WILL_PER_LEVEL_UP, SkillsService } from "../../game";
import { Transactional } from "typeorm-transactional";
import { UserSkillsService } from "../../inventory";

@Injectable()
export class LevelUpService {

    constructor(
        @Inject(DELTA_ATTACK_PER_LEVEL_UP)
        private readonly _deltaAttack: number,
        @Inject(DELTA_WILL_PER_LEVEL_UP)
        private readonly _deltaWill: number,
        @Inject(SkillsService)
        private readonly _skillsService: SkillsService,
        @Inject(UserSkillsService)
        private readonly _userSkillsService: UserSkillsService
    ) {}

    @Transactional()
    async handleLevelUp(dto: LevelUpDTO): Promise<void> {
       const { userId, stat: { level, attack, will } } = dto;

       const skillIds = pipe(
           await this._skillsService.getSkillsBy({
               minLevel: level,
               minAttack: [attack - this._deltaAttack + 1, attack],
               minWill: [will - this._deltaWill + 1, will]
           }),
           map(prop("id")),
           toArray
       );

       await this._userSkillsService.addUserSkills({ userId, skillIds });
    }
}