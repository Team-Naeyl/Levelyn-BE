import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { Item } from "./model";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemDTO } from "./dto";
import { TypeDTO } from "../common";
import { map, pipe, toArray } from "@fxts/core";

@Injectable()
export class ItemsService  {

    constructor(
        @InjectRepository(Item)
        private readonly _itemsRepos: Repository<Item>
    ) {}

    async getAllItems(): Promise<ItemDTO[]> {
        return pipe(
            await this._itemsRepos.find({ cache: true }),
            map(ItemsService.toItemDTO),
            toArray
        );
    }

    static toItemDTO(item: Item): ItemDTO {
        const { id, name, description, weight } = item;

        const type: TypeDTO = {
            id: item.type.id,
            value: item.subType?.value ?? item.type.value
        };

        return { id, type, name, description, weight };
    }

}
