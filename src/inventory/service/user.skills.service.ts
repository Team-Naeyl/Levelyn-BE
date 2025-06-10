import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSkill }                        from "../model";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { Transactional }                    from "typeorm-transactional";
import { GetUserSkillsDTO, UpsertUserSkillsDTO, UserSkillDTO }                                  from "../dto";
import { concat, difference, identity, isArray, map, pipe, prop, throwError, throwIf, toArray } from "@fxts/core";

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
        return await this.getUserSkillsBy({ userId })
            .then(UserSkill.toDTOArray)
            .catch(throwError(identity));
    }

    @Transactional()
    async updateEquipped(dto: UpsertUserSkillsDTO): Promise<void> {
        const { userId } = dto;

        const oldIds = await this.getUserSkillsBy({ userId, equipped: true })
            .then(map(prop("id")))
            .catch(throwError(identity));

        const newIds = await this.getUserSkillsBy(dto)
            .then(map(prop("id")))
            .catch(throwError(identity));

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
            where => this._userSkillsRepos.findBy(where),
            throwIf(
                userSkills => {
                    return isArray(dto.skillIds)
                        && userSkills.length !== dto.skillIds.length;
                },
                () => new NotFoundException()
            )
        )
    }
}

function __makeWhereOptions(dto: GetUserSkillsDTO): FindOptionsWhere<UserSkill> {
    const { skillIds, ...rest } = dto;
    return skillIds ? { ...rest, skillId: In(skillIds) } : rest;
}



