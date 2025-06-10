import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Skill } from "../skill.model";
import { Repository } from "typeorm";
import { SkillDTO } from "../dto";

@Injectable()
export class SkillsService {
    private readonly _logger: Logger = new Logger(SkillsService.name);

    constructor(
       @InjectRepository(Skill)
       private readonly _skillsRepository: Repository<Skill>,
    ) {}

    async getAllSkills(): Promise<SkillDTO[]> {
        const skills = await this._skillsRepository.find();
        return skills.map(skill => skill.toDTO());
    }
}