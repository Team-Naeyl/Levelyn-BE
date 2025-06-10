import { DynamicModule, Module } from "@nestjs/common";
import Redis from "ioredis";
import { redisFactory } from "./redis.factory";
import { ConfigService } from "@nestjs/config";

@Module({})
export class RedisModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RedisModule,
      global: true,
      providers: [{
        provide: Redis,
        useFactory: redisFactory,
        inject: [ConfigService],
      }],
      exports: [Redis]
    };
  }
}