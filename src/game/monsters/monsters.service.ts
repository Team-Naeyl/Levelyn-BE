import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Monster } from "./model";
import { Repository } from "typeorm";
import { MonsterDTO } from "./dto";
import { excludeTimestampOnly } from "../../common";
import { Random } from "random";
import { isUndefined, pipe, throwIf } from "@fxts/core";

@Injectable()
export class MonstersService {

    constructor(
        @InjectRepository(Monster)
        private readonly _monstersRepos: Repository<Monster>,
        @Inject(Random)
        private readonly _random: Random
    ) {  }

    async getLocalMonster(regionId: number): Promise<MonsterDTO> {
        return pipe(
            await this._monstersRepos.find({ where: { regionId }, cache: true }),
            monsters => this._random.choice(monsters),
            throwIf(isUndefined, () => Error("No monster found")),
            __toDTO
        );
    }


}

function __toDTO(monster: Monster): MonsterDTO {
    const { type, ...rest } = excludeTimestampOnly(monster);
    return { ...rest, type: excludeTimestampOnly(type) };
}
