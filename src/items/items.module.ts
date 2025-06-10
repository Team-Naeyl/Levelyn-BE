import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item, ItemType } from "./model";
import { ItemsService } from './items.service';

@Module({
    imports: [TypeOrmModule.forFeature([Item, ItemType]),],
    providers: [ItemsService],
    exports: [ItemsService]
})
export class ItemsModule {}
