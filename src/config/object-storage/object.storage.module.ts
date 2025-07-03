import { DynamicModule, FactoryProvider, Global, Module } from "@nestjs/common";
import { SchemaConstructor } from "./types";
import { getStorageToken } from "./reflection";
import Redis from "ioredis";
import { ObjectStorage } from "./object.storage";

@Global()
@Module({})
export class ObjectStorageModule {
    static forFeature(Schemas: SchemaConstructor<any>[]): DynamicModule {

        const providers: FactoryProvider[] = Schemas.map(Schema => ({
            provide: getStorageToken(Schema),
            useFactory: (redis: Redis) =>
                new ObjectStorage(redis, Schema),
            inject: [Redis]
        }));

        return {
            module: ObjectStorageModule,
            providers,
            exports: providers.map(({ provide }) => provide)
        };
    }
}