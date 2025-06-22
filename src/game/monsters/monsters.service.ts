import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Monster } from "./model";
import { Repository } from "typeorm";
import { MonsterDTO } from "./dto";

@Injectable()
export class MonstersService {

    constructor(
        @InjectRepository(Monster)
        private readonly _monstersRepos: Repository<Monster>,
    ) {}

    async getLocalMonsters(regionId: number): Promise<MonsterDTO[]> {

        const monsters = await this._monstersRepos.find({
            cache: true, where: { regionId }
        });

        return monsters.map(m => m.toDTO());
    }
}
