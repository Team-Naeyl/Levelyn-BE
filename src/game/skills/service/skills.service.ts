import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Skill } from "../model";
import { Between, FindOperator, FindOptionsWhere, LessThanOrEqual, Repository } from "typeorm";
import { GetSKillsDTO, SkillDTO } from "../dto";
import { compactObject, entries, fromEntries, isNumber, map, pick, pipe, toArray } from "@fxts/core";

@Injectable()
export class SkillsService {
    private readonly _logger: Logger = new Logger(SkillsService.name);

    constructor(
       @InjectRepository(Skill)
       private readonly _skillsRepository: Repository<Skill>,
    ) { }

    async getAllSkills(): Promise<SkillDTO[]> {
        const skills = await this._skillsRepository.find({ cache: true });
        return skills.map(SkillsService.toSkillDTO);
    }

    getSkillsBy(dto: GetSKillsDTO): Promise<SkillDTO[]> {
        return pipe(
            __makeWhereOptions(dto),
            where => this._skillsRepository.findBy(where),
            map(SkillsService.toSkillDTO),
            toArray
        );
    }

    static toSkillDTO(skill: Skill): SkillDTO {
        return pick(["id", "name", "description"], skill);
    }
}

function __makeWhereOptions(dto: GetSKillsDTO): FindOptionsWhere<Skill> {
    return pipe(
        compactObject(dto),
        entries,
        map(([k, v]): [keyof GetSKillsDTO, FindOperator<number>] =>{
            return [k, isNumber(v) ? LessThanOrEqual(v!) : Between(...v!)];
        }),
        fromEntries,
        requirement => ({ requirement })
    );
}