import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserSkill } from "../model";
import { In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { AddUserSkillsDTO, UserSkillDTO } from "../dto";
import { concat, difference, identity, map, prop, throwError, throwIf } from "@fxts/core";

@Injectable()
export class UserSkillsService {
    private readonly _logger: Logger = new Logger(UserSkillsService.name);

    constructor(
        @InjectRepository(UserSkill)
        private readonly _userSkillsRepos: Repository<UserSkill>
    ) {}

    async addUserSkills(dto: AddUserSkillsDTO): Promise<UserSkillDTO[]> {
        const { userId, skillIds } = dto;

        const userSkills: UserSkill[] = await this._userSkillsRepos.save(
            skillIds.map(skillId => ({ userId, skillId }))
        );

        return UserSkill.toDTOArray(userSkills);
    }

    async getUserSkills(userId: number): Promise<UserSkillDTO[]> {
        return await this._userSkillsRepos.findBy({ userId })
            .then(UserSkill.toDTOArray)
            .catch(throwError(identity));
    }

    @Transactional()
    async updateEquipped(dto: AddUserSkillsDTO): Promise<void> {
        const { userId, skillIds } = dto;

        const oldIds = await this._userSkillsRepos
            .findBy({ userId, equipped: true })
            .then(map(prop("id")))
            .catch(throwError(identity));

        const newIds = await this._userSkillsRepos
            .findBy({ userId, skillId: In(skillIds) })
            .then(throwIf(
                userSkills => userSkills.length !== skillIds.length,
                () => new NotFoundException()
            ))
            .then(map(prop("id")))
            .catch(throwError(identity));

        const ids = concat(
            difference(oldIds, newIds),
            difference(newIds, oldIds)
        );

        await this._userSkillsRepos.update([...ids], {
            equipped: () => '!equipped'
        });
    }


}



