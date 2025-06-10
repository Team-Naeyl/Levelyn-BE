import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item, UserItem } from "./model";
import { InventoryController } from './inventory.controller';
import { AuthModule } from "../auth/auth.module";
import { JwtAuthGuard } from "../auth/jwt.auth.guard";
import { UserItemsService } from "../inventory/service/user.items.service";
import { ItemsService } from './items.service';

const EXTERNAL_PROVIDERS = [JwtAuthGuard];

@Module({
    imports: [
        TypeOrmModule.forFeature([Item, UserItem]),
        AuthModule
    ],
    controllers: [InventoryController],
    providers: [
        ...EXTERNAL_PROVIDERS,
        UserItemsService,
        ItemsService
    ],
    exports: [ItemsService, UserItemsService]
})
export class ItemsModule {}
