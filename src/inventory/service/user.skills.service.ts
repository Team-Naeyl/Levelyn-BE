import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSkill } from "../model";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { GetUserSkillsDTO, UpsertUserSkillsDTO, UserSkillDTO } from "../dto";
import { concat, difference, identity, isArray, map, pipe, prop, tap, throwError, throwIf, toArray } from "@fxts/core";

@Injectable()
export class UserSkillsService {
    private readonly _logger: Logger = new Logger(UserSkillsService.name);

    constructor(
        @InjectRepository(UserSkill)
        private readonly _userSkillsRepos: Repository<UserSkill>
    ) {}

    async addUserSkills(dto: UpsertUserSkillsDTO): Promise<UserSkillDTO[]> {
        const { userId, skillIds } = dto;

        const userSkills: UserSkill[] = await this._userSkillsRepos.save(
            skillIds.map(skillId => ({ userId, skillId }))
        );

        return UserSkill.toDTOArray(userSkills);
    }

    async getUserSkills(userId: number): Promise<UserSkillDTO[]> {
       const userSkills = await this.getUserSkillsBy({ userId });
       return UserSkill.toDTOArray(userSkills);
    }

    @Transactional()
    async updateEquipped(dto: UpsertUserSkillsDTO): Promise<void> {
        const { userId } = dto;

        const oldIds = pipe(
            await this.getUserSkillsBy({ userId, equipped: true }),
            map(prop("id")),
            toArray
        );

        const newIds =  pipe(
            await this.getUserSkillsBy(dto),
            map(prop("id")),
            toArray
        );

        const ids = pipe(
            difference(newIds, oldIds),
            concat(difference(oldIds, newIds)),
            toArray
        );


        await this._userSkillsRepos.update(ids, { equipped: () => '!equipped' })
            .then(throwIf(
                ({ affected }) => affected! !== ids.length,
                () => Error("Query failed")
            )).catch(throwError(identity));
    }

    private getUserSkillsBy(dto: GetUserSkillsDTO): Promise<UserSkill[]> {
        return pipe(
            __makeWhereOptions(dto),
            where => this._userSkillsRepos.findBy(where)
        )
    }
}

function __makeWhereOptions(dto: GetUserSkillsDTO): FindOptionsWhere<UserSkill> {
    const { skillIds, ...rest } = dto;
    return skillIds ? { ...rest, skillId: In(skillIds) } : rest;
}



