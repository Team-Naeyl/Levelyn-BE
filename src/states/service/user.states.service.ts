import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserState } from "../model";
import { Repository } from "typeorm";
import { UserStateDTO, UpdateStateDTO } from "../dto";
import { isNull, pick, pipe, throwIf } from "@fxts/core";
import { Transactional } from "typeorm-transactional";
import { DELTA_ATTACK_PER_LEVEL_UP, DELTA_WILL_PER_LEVEL_UP, MAX_EXP, REGION_INTERVAL } from "../../game";
import { LevelUpService } from "./level.up.service";

@Injectable()
export class UserStatesService {

    constructor(
        @InjectRepository(UserState)
        private readonly _statesRepos: Repository<UserState>,
        @Inject(MAX_EXP)
        private readonly _maxExp: number,
        @Inject(DELTA_ATTACK_PER_LEVEL_UP)
        private readonly _deltaAttack: number,
        @Inject(DELTA_WILL_PER_LEVEL_UP)
        private readonly _deltaWill: number,
        @Inject(REGION_INTERVAL)
        private readonly _regionInterval: number,
        @Inject(LevelUpService)
        private readonly _levelUpService: LevelUpService,
    ) {}

    async getUserState(id: number): Promise<UserStateDTO> {
        return pipe(
            await this._statesRepos.findOneBy({ id }),
            throwIf(isNull, () => new NotFoundException()),
            us => us.toDTO()
        );
    }

    @Transactional()
    async updateState(dto: UpdateStateDTO): Promise<void> {
        const { id, userId, ...delta } = dto;

        const state = pipe(
            await this._statesRepos.findOneBy({ id }),
            throwIf(isNull, () => new NotFoundException()),
            state => state.toDTO()
        );

        this.updatePosition(state, delta.deltaPosition ?? 0);
        const levelUp = this.updateExp(state, delta.deltaExp ?? 0);

        await this._statesRepos.update(id, state);

        levelUp && await this._levelUpService.handleLevelUp({
            userId,
            stat: pick(["level", "attack", "will"], state)
        });
    }

    private updatePosition(state: UserStateDTO, deltaPosition: number): void {
        state.position += deltaPosition;
        (state.position % this._regionInterval) || ++state.regionId;
    }

    private updateExp(state: UserStateDTO, deltaExp: number): boolean {
        state.exp += deltaExp;
        const levelUp = state.exp >= this._maxExp;

        if (levelUp) {
            state.exp -= this._maxExp;
            ++state.level;
            state.attack += this._deltaAttack;
            state.will += this._deltaWill;
        }

        return levelUp;
    }


}