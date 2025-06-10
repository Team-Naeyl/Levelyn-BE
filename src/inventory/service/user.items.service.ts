import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserItem } from "../model";
import { Repository } from "typeorm";
import { AddUserItemsDTO, GetUserItemDTO, UserItemDTO } from "../dto";
import { Transactional } from "typeorm-transactional";
import { identity, throwError, throwIf } from "@fxts/core";


@Injectable()
export class UserItemsService {
    private readonly _logger: Logger = new Logger(UserItemsService.name);

    constructor(
        @InjectRepository(UserItem)
        private readonly _userItemsRepos: Repository<UserItem>,
    ) {}

    async addUserItems(dto: AddUserItemsDTO): Promise<UserItemDTO[]> {
       const { userId, itemIds } = dto;

       const userItems: UserItem[] = await this._userItemsRepos.save(
           itemIds.map(itemId => ({ userId, itemId }))
       );

       return UserItem.toDTOArray(userItems);
    }

    async getUserItems(userId: number): Promise<UserItemDTO[]> {
       return await this._userItemsRepos.findBy({ userId })
           .then(UserItem.toDTOArray)
           .catch(throwError(identity));
    }

    @Transactional()
    async updateEquipped(dto: GetUserItemDTO): Promise<void> {
        const userItem = await this._userItemsRepos.findOneBy(dto);
        if (!userItem) throw new NotFoundException();

        const ids = [userItem.id];

        if (!userItem.equipped) {
            const { userId, item: { typeId } } = userItem;

            const old = await this._userItemsRepos.findOne({
                relations: { item: true },
                where: { userId, equipped: true, item: { typeId } }
            });

            old && ids.push(old.id);
        }

        await this._userItemsRepos.update(ids, { equipped: () => '!equipped' })
            .then(throwIf(
                ({ affected }) => affected! !== ids.length,
                () => Error("Query failed")
            )).catch(throwError(identity));
    }

}