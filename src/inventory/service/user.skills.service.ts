import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSkill } from "../model";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EquippedSkillDTO, GetUserSkillsDTO, UpsertUserSkillsDTO, UserSkillDTO } from "../dto";
import { concat, difference, map, pipe, throwIf, toArray, toAsync } from "@fxts/core";
import { SkillsService } from "../../game";
import { excludeTimestamp } from "../../common";

@Injectable()
export class UserSkillsService {
    private readonly _logger: Logger = new Logger(UserSkillsService.name);

    constructor(
        @InjectRepository(UserSkill)
        private readonly _userSkillsRepos: Repository<UserSkill>
    ) {  }

    @Transactional()
    async addUserSkills(dto: UpsertUserSkillsDTO): Promise<UserSkillDTO[]> {
        const { userId, skillIds } = dto;
        if (!skillIds.length) return [];

        const userSkills: UserSkill[] = await this._userSkillsRepos.save(
            skillIds.map(skillId => ({ userId, skillId }))
        );

        return await this.getUserSkills({ userId, skillIds });
    }

    async getUserSkills(dto: GetUserSkillsDTO): Promise<UserSkillDTO[]> {
       const userSkills = await this.getUserSkillsBy(dto);
       return userSkills.map(__toDTO);
    }

    async getEquippedSkills(userId: number): Promise<EquippedSkillDTO[]> {
        return pipe(
            await this.getUserSkillsBy({ userId, equipped: true }),
            map(async ({ skill }) => {
                const effect = await skill.effect;

                return {
                    ...SkillsService.toSkillDTO(skill),
                    ...excludeTimestamp(effect, "id")
                } as EquippedSkillDTO;
            }),
            toAsync,
            toArray
        );
    }

    @Transactional()
    async updateEquipped(dto: UpsertUserSkillsDTO): Promise<void> {
        const { userId } = dto;

        const ids = __symmetricDifference(
            await this.getUserSkillIdsBy({ userId, equipped: true }),
            await this.getUserSkillIdsBy(dto)
        );

       if (ids.length) {
           pipe(
               await this._userSkillsRepos.update(ids, { equipped: () => '!equipped' }),
               throwIf(
                   ({ affected }) => affected! !== ids.length,
                   () => Error("Query failed")
               )
           );
       }
    }

    private getUserSkillsBy(dto: GetUserSkillsDTO): Promise<UserSkill[]> {
        const where = __makeWhereOptions(dto);
        return this._userSkillsRepos.find({ where });
    }

    private async getUserSkillIdsBy(dto: GetUserSkillsDTO): Promise<number[]> {
        const userSkills = await this.getUserSkillsBy(dto);
        return userSkills.map(({ id }) => id);
    }
}

function __makeWhereOptions(dto: GetUserSkillsDTO): FindOptionsWhere<UserSkill> {
    const { skillIds, ...rest } = dto;
    return skillIds ? { ...rest, skillId: In(skillIds) } : rest;
}

function __toDTO(us: UserSkill): UserSkillDTO {
    const { equipped, skill } = us;
    return { equipped, ...SkillsService.toSkillDTO(skill) };
}

function __symmetricDifference(v: number[], w: number[] ): number[] {
    return pipe(
        difference(w, v),
        concat(difference(v, w)),
        toArray
    );
}



