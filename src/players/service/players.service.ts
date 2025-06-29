import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Player } from "../model";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PlayerDTO, UpdatePlayerDTO } from "../dto";
import { isNull, pipe, throwIf } from "@fxts/core";
import { excludeTimestamp } from "../../common";
import { LevelConfig } from "../../game";
import { LevelUpService } from "./level.up.service";

@Injectable()
export class PlayersService {

    constructor(
        @InjectRepository(Player)
        private readonly _playersRepos: Repository<Player>,
        @Inject(LevelUpService)
        private readonly _levelUpService: LevelUpService
    ) {}

    async getPlayer(id: number): Promise<PlayerDTO> {
        return  pipe(
            await this._playersRepos.findOneBy({ id }),
            throwIf(isNull, () => new ForbiddenException()),
            p => excludeTimestamp(p, "id")
        );
    }

    @Transactional()
    async updatePlayer(dto: UpdatePlayerDTO): Promise<void> {
       const { id, deltaExp, deltaPosition } = dto;

       const values = await this.getPlayer(id)
           .then(p => {
               p.exp += deltaExp;
               p.position += deltaPosition;
               return p;
           })
           .then(p => this._levelUpService.levelUpIfQualified(p))
           .catch(err => { throw err; });

       await this._playersRepos.update(id, values);
    }
}
