import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PlayerItem } from "../model";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { UpsertPlayerItemsDTO, PlayerItemDTO, GetPlayerItemsDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import {concat, identity, pipe, throwError, throwIf, filter, map, toArray, prop, toAsync, reduceLazy, omit} from "@fxts/core";
import { ItemEffectDTO } from "../../game/items/dto";
import { ItemsService } from "../../game";

@Injectable()
export class PlayerItemsService {
    private readonly _logger: Logger = new Logger(PlayerItemsService.name);

    constructor(
        @InjectRepository(PlayerItem)
        private readonly _playerItemsRepos: Repository<PlayerItem>,
    ) {  }

    @Transactional()
    async addPlayerItems(dto: UpsertPlayerItemsDTO): Promise<PlayerItemDTO[]> {
       const { playerId, itemIds } = dto;

       const playerItems: PlayerItem[] = await this._playerItemsRepos.save(
           itemIds.map(itemId => ({ playerId, itemId }))
       );

       return playerItems.map(__toDTO);
    }

    async getPlayerItems(playerId: number): Promise<PlayerItemDTO[]> {
        const playerItems = await this.getPlayerItemsBy({ playerId });
        return playerItems.map(__toDTO);
    }

    async getNetEquippedItemEffect(playerId: number): Promise<ItemEffectDTO> {
        return pipe(
            this.getPlayerItemsBy({ playerId, equipped: true }),
            map(({ item }) => item.effect),
            toAsync,
            reduceLazy(
                (acc, curr) => {
                    Object.keys(acc).forEach(k => acc[k] += curr[k]);
                    return acc;
                },
                { attack: 0, will: 0, exp: 0, pItem: 0, pCoin: 0, penaltyDuration: 0 } as ItemEffectDTO
            )
        )
    }

    @Transactional()
    async updateEquipped(dto: UpsertPlayerItemsDTO): Promise<void> {
        const userItems = await this.getPlayerItemsBy(dto);

        const ids = pipe(
            concat(
                userItems,
                await pipe(
                    userItems,
                    filter(ui => !ui.equipped),
                    map(ui => ui.item.typeId),
                    toArray,
                    typeIds => this.getPlayerItemsBy({ playerId: dto.playerId, typeIds })
                )
            ),
            map(prop("id")),
            toArray
        );

        await this._playerItemsRepos.update(ids, { equipped: () => '!equipped' })
            .then(throwIf(
                ({ affected }) => affected! !== ids.length,
                () => Error("Query failed")
            )).catch(throwError(identity));
    }

    private getPlayerItemsBy(dto: GetPlayerItemsDTO): Promise<PlayerItem[]> {
        return pipe(
            __makeWhereOptions(dto),
            where => this._playerItemsRepos.findBy(where)
        );
    }
}

function __makeWhereOptions(dto: GetPlayerItemsDTO): FindOptionsWhere<PlayerItem> {
    const { itemIds, typeIds, ...rest } = dto;
    const options: FindOptionsWhere<PlayerItem> = { ...rest };
    itemIds && (options.itemId = In(itemIds));
    typeIds && (options.item = { typeId: In(typeIds) });
    return options;
}

function __toDTO(pi: PlayerItem): PlayerItemDTO {
    const { equipped, item } = pi;
    return { equipped, ...omit(["weight"], ItemsService.toItemDTO(item)) };
}