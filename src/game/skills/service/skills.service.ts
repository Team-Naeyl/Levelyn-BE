import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Skill, SkillRequirement } from "../model";
import { Between, FindOperator, FindOptionsWhere, LessThanOrEqual, Repository } from "typeorm";
import { GetSkillsByRequirementDTO, SkillDTO } from "../dto";
import { compactObject, entries, fromEntries, isNumber, map, pick, pipe, toArray } from "@fxts/core";

@Injectable()
export class SkillsService {
    private readonly _logger: Logger = new Logger(SkillsService.name);

    constructor(
       @InjectRepository(Skill)
       private readonly _skillsRepository: Repository<Skill>,
    ) { }

    async getAllSkills(): Promise<SkillDTO[]> {
        return await this.getSkillsBy({});
    }

    async getSkillsByRequirement(dto: GetSkillsByRequirementDTO): Promise<SkillDTO[]> {
        const requirement = __makeWhereOptionsForSkillRequirement(dto);
        return await this.getSkillsBy({ requirement });
    }

    private async getSkillsBy(where: FindOptionsWhere<Skill>): Promise<SkillDTO[]> {

        const skills = await this._skillsRepository.find({
            relations: { requirement: !!where.requirement },
            cache: true,
            where
        });

        return skills.map(SkillsService.toSkillDTO);
    }

    static toSkillDTO(skill: Skill): SkillDTO {
        return pick(["id", "name", "description"], skill);
    }
}

function __makeWhereOptionsForSkillRequirement(
    dto: GetSkillsByRequirementDTO
): FindOptionsWhere<SkillRequirement> {
    return pipe(
        compactObject(dto),
        entries,
        map(([k, v]): [keyof GetSkillsByRequirementDTO, FindOperator<number>] =>
            [k, isNumber(v) ? LessThanOrEqual(v!) : Between(...v!)]
        ),
        fromEntries
    );
}