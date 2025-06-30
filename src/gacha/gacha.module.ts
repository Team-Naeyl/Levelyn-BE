import { DynamicModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Item, ItemsModule, ItemsService } from "../game";
import { GACHA_OPTIONS, MIN_COIN, P_COIN, P_ITEM } from "./token";
import { GachaResultConfigService, GachaService, ItemTargetsService, RandomCoinService, RandomItemService } from "./service";
import { GachaOptions, RegisterAsyncOptions } from "./options";

const SERVICES = [
    GachaService,
    GachaResultConfigService,
    RandomItemService,
    RandomCoinService,
    ItemTargetsService
];

const TOKENS = [P_ITEM, P_COIN, MIN_COIN, GACHA_OPTIONS];

@Module({})
export class GachaModule {
    static registerAsync({ optionsFactory, inject }: RegisterAsyncOptions): DynamicModule {

        return {
            module: GachaModule,
            imports: [
                TypeOrmModule.forFeature([Item]),
                ItemsModule
            ],
            providers: [
                ...SERVICES,
                ItemsService,
                {
                    provide: GACHA_OPTIONS,
                    useFactory: optionsFactory,
                    inject: inject ?? []
                },
                {
                    provide: P_ITEM,
                    useFactory: (options: GachaOptions) => options.pItem,
                    inject: [GACHA_OPTIONS]
                },
                {
                    provide: P_COIN,
                    useFactory: (options: GachaOptions) => options.pCoin,
                    inject: [GACHA_OPTIONS]
                },
                {
                    provide: MIN_COIN,
                    useFactory: (options: GachaOptions) => options.minCoin,
                    inject: [GACHA_OPTIONS]
                },
            ],
            exports: [
                ItemsService,
                ...SERVICES,
                ...TOKENS
            ]
        }
    }
}