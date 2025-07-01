import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSkill } from "../model";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { EquippedSkillDTO, GetUserSkillsDTO, UpsertUserSkillsDTO, UserSkillDTO } from "../dto";
import { concat, difference, identity, map, pipe, prop, throwError, throwIf, toArray, toAsync } from "@fxts/core";
import { LevelConfig, SkillsService } from "../../game";
import { excludeTimestamp } from "../../common";
import { UnlockSkillsDTO } from "../dto/skill/unlock.skills.dto";

@Injectable()
export class UserSkillsService {
    private readonly _logger: Logger = new Logger(UserSkillsService.name);

    constructor(
        @InjectRepository(UserSkill)
        private readonly _userSkillsRepos: Repository<UserSkill>,
        @Inject(SkillsService)
        private readonly _skillsService: SkillsService,
        @Inject(LevelConfig)
        private readonly _levelConfig: LevelConfig
    ) {  }

    @Transactional()
    async addUserSkills(dto: UpsertUserSkillsDTO): Promise<UserSkillDTO[]> {
        const { userId, skillIds } = dto;
        if (!skillIds.length) return [];

        const userSkills: UserSkill[] = await this._userSkillsRepos.save(
            skillIds.map(skillId => ({ userId, skillId }))
        );

        return userSkills.map(__toDTO);
    }

    async getUserSkills(userId: number): Promise<UserSkillDTO[]> {
       const userSkills = await this.getUserSkillsBy({ userId });
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

function __toDTO(us: UserSkill): UserSkillDTO {
    const { equipped, skill } = us;
    return { equipped, ...SkillsService.toSkillDTO(skill) };
}



