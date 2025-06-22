import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { Item } from "../model";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemDTO } from "../dto";

@Injectable()
export class ItemsService {

    constructor(
        @InjectRepository(Item)
        private readonly _itemsRepos: Repository<Item>
    ) {}

    async getAllItems(): Promise<ItemDTO[]> {
        const items = await this._itemsRepos.find({ cache: true });
        return items.map(item => item.toDTO());
    }

}
