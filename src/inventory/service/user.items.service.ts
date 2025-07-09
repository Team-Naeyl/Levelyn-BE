import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserItem } from "../model";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { UpsertUserItemsDTO, UserItemDTO, GetUserItemsDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import {
    concat,
    identity,
    pipe,
    throwError,
    throwIf,
    filter,
    map,
    toArray,
    prop,
    toAsync,
    reduceLazy,
    omit
} from "@fxts/core";
import { ItemEffectDTO } from "../../game/items/dto";
import { ItemsService } from "../../game";

@Injectable()
export class UserItemsService {
    private readonly _logger: Logger = new Logger(UserItemsService.name);

    constructor(
        @InjectRepository(UserItem)
        private readonly _userItemsRepos: Repository<UserItem>,
    ) {  }

    @Transactional()
    async addUserItems(dto: UpsertUserItemsDTO): Promise<UserItemDTO[]> {
       const { userId, itemIds } = dto;
       if (!itemIds.length) return [];

       await this._userItemsRepos
           .createQueryBuilder()
           .insert()
           .into(UserItem)
           .values(
               itemIds.map(itemId => {
                   const ui = this._userItemsRepos.create();
                   return Object.assign(ui, { userId, itemId });
               })
           )
           .orIgnore()
           .execute();

       return await this.getUserItems({ userId, itemIds });
    }

    async getUserItems(dto: GetUserItemsDTO): Promise<UserItemDTO[]> {
        const userItems = await this.getUserItemsBy(dto);
        return userItems.map(__toDTO);
    }

    async getNetEquippedItemEffect(userId: number): Promise<ItemEffectDTO> {
        return pipe(
            this.getUserItemsBy({ userId, equipped: true }),
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
    async updateEquipped(dto: UpsertUserItemsDTO): Promise<void> {
        const userItems = await this.getUserItemsBy(dto);

        const ids = pipe(
            await pipe(
                userItems,
                filter(ui => !ui.equipped),
                map(ui => ui.item.typeId),
                typeIds => this.getUserItemsBy({
                    userId: dto.userId,
                    typeIds: [...typeIds],
                    equipped: true
                })
            ),
            concat(userItems),
            map(prop("id")),
            toArray
        );

        if (ids.length) {
            await this._userItemsRepos.update(ids, { equipped: () => '!equipped' })
                .then(throwIf(
                    ({ affected }) => affected! !== ids.length,
                    () => Error("Query failed")
                )).catch(throwError(identity));
        }
    }



    private getUserItemsBy(dto: GetUserItemsDTO): Promise<UserItem[]> {
        return pipe(
            __makeWhereOptions(dto),
            where => this._userItemsRepos.findBy(where)
        );
    }
}

function __makeWhereOptions(dto: GetUserItemsDTO): FindOptionsWhere<UserItem> {
    const { itemIds, typeIds, ...rest } = dto;
    const options: FindOptionsWhere<UserItem> = { ...rest };
    itemIds && (options.itemId = In(itemIds));
    typeIds && (options.item = { typeId: In(typeIds) });
    return options;
}

function __toDTO(ui: UserItem): UserItemDTO {
    const { equipped, item } = ui;
    return { equipped, ...omit(["weight"], ItemsService.toItemDTO(item)) };
}