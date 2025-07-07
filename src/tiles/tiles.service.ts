import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Random } from "random";
import { TileConfig } from "../game";
import { StatesService } from "../states";
import { InjectRepository } from "@nestjs/typeorm";
import { Tile } from "./tile.model";
import { Repository } from "typeorm";
import { isNull, pick, pipe, throwIf } from "@fxts/core";
import { ClearTileResult, SetPenaltyDTO, TileDTO } from "./dto";

@Injectable()
export class TilesService {
    private readonly isBattleEvent: () => boolean;

    constructor(
        @InjectRepository(Tile)
        private readonly _tilesRepos: Repository<Tile>,
        @Inject(Random)
        random: Random,
        @Inject(TileConfig)
        { pBattleEvent }: TileConfig
    ) {
        const dist = random.binomial(1, pBattleEvent);
        this.isBattleEvent = () => Boolean(dist());
    }

    async getTile(userId: number): Promise<TileDTO> {
        const tile = await this.getTileById(userId);
        return __toDTO(tile);
    }

    async clearTile(userId: number): Promise<ClearTileResult> {
       const { position, penaltyCount } = await this.getTileById(userId);

       const values = {
           position: position + 1,
           penaltyCount: penaltyCount && penaltyCount - 1
       };

       await this._tilesRepos.update(userId, values);

       return {
           userId,
           position,
           penalty: !!penaltyCount,
           battle: this.isBattleEvent()
       };
    }

    async setPenalty(dto: SetPenaltyDTO): Promise<void> {
        const { id, penaltyCount } = dto;
        await this._tilesRepos.update(id, { penaltyCount });
    }

    private async getTileById(id: number): Promise<Tile> {
        return pipe(
            await this._tilesRepos.findOneBy({ id }),
            throwIf(isNull, () => new ForbiddenException())
        );
    }
}

function __toDTO(tile: Tile): TileDTO {
    return pick(["position", "penaltyCount"], tile);
}
