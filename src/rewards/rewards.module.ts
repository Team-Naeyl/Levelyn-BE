import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item, ItemsService } from "../game/items";
import { YamlConfigModule } from "../config/yaml-config";
import { RewardConfig } from "../game/config";
import { RandomBoxesService, RandomCoinService, RandomItemService, RewardsService } from "./service";

const EXTERNAL_PROVIDERS = [ItemsService];

const PROVIDERS = [
  RewardsService,
  RandomBoxesService,
  RandomItemService,
  RandomCoinService
];

@Module({
    imports: [
        TypeOrmModule.forFeature([Item]),
        YamlConfigModule.forFeature([RewardConfig])
    ],
    providers:[
        ...EXTERNAL_PROVIDERS,
        ...PROVIDERS,
    ],
    exports: [
        ...PROVIDERS
    ]
})
export class RewardsModule {}