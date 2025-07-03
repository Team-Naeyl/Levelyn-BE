import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item, ItemsModule, ItemsService } from "../items";
import { YamlConfigModule } from "../../config/yaml-config";
import { RewardConfig } from "../config";
import { RandomBoxesService, RandomCoinService, RandomItemService } from "./service";

const EXTERNAL_PROVIDERS = [ItemsService];

const PROVIDERS = [
    RandomBoxesService,
    RandomItemService,
    RandomCoinService
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]),
        YamlConfigModule.forFeature([RewardConfig]),
        ItemsModule
    ],
    providers: [
        ...EXTERNAL_PROVIDERS,
        ...PROVIDERS
    ],
    exports: [...PROVIDERS, ...EXTERNAL_PROVIDERS]
})
export class RandomBoxesModule {}