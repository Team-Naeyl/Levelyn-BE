import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserItem } from "../model";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { UpsertUserItemsDTO, UserItemDTO, GetUserItemsDTO } from "../dto";
import { Transactional }                                                                          from "typeorm-transactional";
import { concat, identity, pipe, throwError, throwIf, filter, map, toArray, prop } from "@fxts/core";

@Injectable()
export class UserItemsService {
    private readonly _logger: Logger = new Logger(UserItemsService.name);

    constructor(
        @InjectRepository(UserItem)
        private readonly _userItemsRepos: Repository<UserItem>,
    ) {}

    @Transactional()
    addUserItems(dto: UpsertUserItemsDTO): Promise<UserItemDTO[]> {
       const { userId, itemIds } = dto;

       return pipe(
           itemIds.map(itemId => ({ userId, itemId })),
           vals => this._userItemsRepos.save(vals),
           map(userItem => userItem.toDTO()),
           toArray
       );
    }

    async getUserItems(userId: number): Promise<UserItemDTO[]> {
        const userItems = await this.getUserItemsBy({ userId });
        return UserItem.toDTOArray(userItems);
    }

    @Transactional()
    async updateEquipped(dto: UpsertUserItemsDTO): Promise<void> {
        const userItems = await this.getUserItemsBy(dto);

        const ids = pipe(
            concat(
                userItems,
                await pipe(
                    userItems,
                    filter(ui => !ui.equipped),
                    map(ui => ui.item.typeId),
                    toArray,
                    typeIds => this.getUserItemsBy({ userId: dto.userId, typeIds })
                )
            ),
            map(prop("id")),
            toArray
        );

        await this._userItemsRepos.update(ids, { equipped: () => '!equipped' })
            .then(throwIf(
                ({ affected }) => affected! !== ids.length,
                () => Error("Query failed")
            )).catch(throwError(identity));
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

