import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { State } from "../model";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { StateDTO, UpdateStateDTO, UpdateStateResult } from "../dto";
import { isNull, omit, pick, pipe, throwIf } from "@fxts/core";
import { excludeTimestamp } from "../../common";
import { LevelConfig } from "../../game";
import { UnlockSkillsService } from "./unlock.skills.service";

@Injectable()
export class StatesService {

    constructor(
        @InjectRepository(State)
        private readonly _statesRepos: Repository<State>,
        @Inject(LevelConfig)
        private readonly _levelConfig: LevelConfig,
        @Inject(UnlockSkillsService)
        private readonly _unlockSkillsService: UnlockSkillsService,
    ) {}

    async getState(id: number): Promise<StateDTO> {
        return  pipe(
            await this._statesRepos.findOneBy({ id }),
            throwIf(isNull, () => new ForbiddenException()),
            s => excludeTimestamp(s, "id")
        );
    }

    @Transactional()
    async updateState(dto: UpdateStateDTO): Promise<UpdateStateResult> {
       const { id, deltaExp, deltaPosition } = dto;

       const [values, levelUp] = pipe(
           await this.getState(id),
           s => {
               s.exp += deltaExp;
               s.position += deltaPosition;
               return s;
           },
           s => this.levelUpIfQualified(s)
       )

       await this._statesRepos.update(id, values);
       levelUp && await this.unlockSkills(id, values);
       return { levelUp, ...values };
    }

    private levelUpIfQualified(state: StateDTO): [StateDTO, boolean] {

        if (state.exp >= this._levelConfig.maxExp) {
            state.exp -= this._levelConfig.maxExp;
            ++state.level;
            state.attack += this._levelConfig.deltaAttack;
            state.will += this._levelConfig.deltaWill;
            return [state, true];
        }

        return [state, false];
    }

    private async unlockSkills(
        userId: number,
        state: StateDTO
    ): Promise<void> {
        await this._unlockSkillsService.unlockSKills({
            userId, ...state,
            ...omit(["maxExp"], this._levelConfig)
        });
    }
}
