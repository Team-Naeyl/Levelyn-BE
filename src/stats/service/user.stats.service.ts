import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserStat } from "../model";
import { Repository } from "typeorm";
import { UpdateExpDTO, UserStatDTO } from "../dto";
import { isNull, pick, pipe, throwIf } from "@fxts/core";
import { Transactional } from "typeorm-transactional";
import { DELTA_ATTACK, DELTA_WILL, MAX_EXP } from "../../config/game.system";
import { LevelUpService } from "./level.up.service";

@Injectable()
export class UserStatsService {

    constructor(
        @InjectRepository(UserStat)
        private readonly _userStatsRepos: Repository<UserStat>,
        @Inject(LevelUpService)
        private readonly _levelUpService: LevelUpService
    ) {}

    async getUserStat(id: number): Promise<UserStatDTO> {
        return pipe(
            await this._userStatsRepos.findOneBy({ id }),
            throwIf(isNull, () => new NotFoundException()),
            userStat => userStat.toDTO()
        );
    }

    @Transactional()
    async updateExp(dto: UpdateExpDTO): Promise<void> {
        const { id, deltaExp, userId } = dto;

        const values = pipe(
            await this._userStatsRepos.findOneBy({ id }),
            throwIf(isNull, () => new NotFoundException()),
            stat => pick(["level", "exp", "attack", "will"], stat)
        );

        values.exp += deltaExp;
        const levelUp = values.exp >= MAX_EXP;

        if (levelUp) {
            ++values.level;
            values.exp -= MAX_EXP;
            values.attack += DELTA_ATTACK;
            values.will += DELTA_WILL;
        }

        await this._userStatsRepos.update(id, values);
        levelUp && await this._levelUpService.handleLevelUp({ userId, ...values });
    }
}