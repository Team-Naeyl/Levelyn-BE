import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Monster } from "./model";
import { Repository } from "typeorm";
import { MonsterDTO } from "./dto";
import { excludeTimestampOnly } from "../../common";
import { map, pipe, toArray } from "@fxts/core";

@Injectable()
export class MonstersService {

    constructor(
        @InjectRepository(Monster)
        private readonly _monstersRepos: Repository<Monster>,
    ) {  }

    async getLocalMonsters(regionId: number): Promise<MonsterDTO[]> {
        return pipe(
            await this._monstersRepos.find({ where: { regionId }, cache: true }),
            map(__toDTO),
            toArray
        );
    }
}

function __toDTO(monster: Monster): MonsterDTO {
    const { type, ...rest } = excludeTimestampOnly(monster);
    return { ...rest, type: excludeTimestampOnly(type) };
}
