import { DynamicModule, Module } from "@nestjs/common";
import Redis, { RedisOptions } from "ioredis";

@Module({})
export class RedisModule {
  static forRoot(
    options: Partial<RedisOptions>
  ): DynamicModule {
    return {
      module: RedisModule,
      global: true,
      providers: [{
        provide: Redis,
        useFactory: () => new Redis(options),
      }],
      exports: [Redis]
    };
  }
}