import { DynamicModule, Module } from "@nestjs/common";
import { Random } from "random";
import { randomFactory } from "./random.factory";
import { ConfigService } from "@nestjs/config";

@Module({})
export class RandomModule {
    static forRootAsync(): DynamicModule {
        return {
            module: RandomModule,
            global: true,
            providers: [
                { provide: Random,  useFactory: randomFactory, inject: [ConfigService] }
            ],
            exports: [Random],
        };
    }
}