import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { State } from "./state.model";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { StateDTO, UpdateStateDTO, UpdateStateResult } from "./dto";
import { isNull, omit,  pipe, throwIf } from "@fxts/core";
import { excludeTimestamp } from "../common";
import { LevelConfig } from "../game";
import { SkillDTO } from "../game/skills/dto";
import { CommandBus } from "@nestjs/cqrs";
import { UnlockSkillsCommand } from "../inventory/command";

@Injectable()
export class StatesService {
    private readonly _logger: Logger = new Logger(StatesService.name);

    constructor(
        @InjectRepository(State)
        private readonly _statesRepos: Repository<State>,
        @Inject(LevelConfig)
        private readonly _levelConfig: LevelConfig,
        @Inject(CommandBus)
        private readonly _commandBus: CommandBus,
    ) {}

    async getState(id: number): Promise<StateDTO> {
       const state = await this.getSkillBy({ id });
       this._logger.log(JSON.stringify(state));
       return excludeTimestamp(state, "id");
    }

    @Transactional()
    async updateState(dto: UpdateStateDTO): Promise<UpdateStateResult> {
       const { id, deltaExp } = dto;

       const [values, levelUp] = pipe(
           await this.getState(id),
           s => {
               s.exp += deltaExp;
               return s;
           },
           s => this.levelUpIfQualified(s)
       )

       await this._statesRepos.update(id, values);

       return {
           levelUp,
           level: values.level,
           newSkills: levelUp ? await this.unlockSkills(id, values) : []
       };
    }

    private async getSkillBy(where: FindOptionsWhere<State>): Promise<State> {
        return pipe(
            await this._statesRepos.findOneBy(where),
            throwIf(isNull, () => new ForbiddenException()),
        );
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

    unlockSkills(userId: number, state: StateDTO): Promise<SkillDTO[]> {
        return this._commandBus.execute(
            new UnlockSkillsCommand({
                userId,
                ...state,
                ...omit(["maxExp"], this._levelConfig)
            })
        );
    }
}
