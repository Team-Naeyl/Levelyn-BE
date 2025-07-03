import { Global, Module } from "@nestjs/common";
import Redis from "ioredis";
import { redisFactory } from "./redis.factory";
import { ConfigService } from "@nestjs/config";
import { RedisCircularQueue } from "./redis.circular.queue";

@Global()
@Module({
  providers: [
    {
      provide: Redis,
      useFactory: redisFactory,
      inject: [ConfigService],
    },
    RedisCircularQueue
  ],
  exports: [Redis, RedisCircularQueue],
})
export class RedisModule {}