import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Player } from "./model";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PlayerDTO, UpdatePlayerDTO } from "./dto";
import { isNull, pipe, throwIf } from "@fxts/core";
import { excludeTimestamp } from "../common";

@Injectable()
export class PlayersService {

    constructor(
        @InjectRepository(Player)
        private readonly _playersRepos: Repository<Player>
    ) {}

    async getPlayer(id: number): Promise<PlayerDTO> {
        return pipe(
            await this._playersRepos.findOneBy({ id: id }),
            throwIf(isNull, () => new ForbiddenException()),
            p => excludeTimestamp(p, "id")
        );
    }

    @Transactional()
    async updatePlayer(dto: UpdatePlayerDTO): Promise<void> {
       const { id, ...values } = dto;
       await this._playersRepos.update(id, values);
    }
}
