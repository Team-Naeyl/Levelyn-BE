import { Module } from '@nestjs/common';
import { UsersModule } from './users';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { join } from "node:path";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as process from "node:process";
import { RedisModule } from "./config/redis";
import { HttpModule } from "@nestjs/axios";
import { SkillsModule } from './skills/skills.module';
import { ItemsModule } from './items/items.module';
import { BadgesModule } from './badges/badges.module';
import { ToDoModule } from './to-do/to-do.module';
import { WalletsModule } from './wallets';
import { DashboardsModule } from './dashboards';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: join(__dirname, "..", ".env")
      }),
      TypeOrmModule.forRoot({
          type: process.env.DB_TYPE as any,
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT || 3306),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [__dirname + '/**/*.model{.ts,.js}'],
          logging: true
      }),
      RedisModule.forRoot({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT || 6379),
          username: process.env.REDIS_USERNAME,
          password: process.env.REDIS_PASSWORD,
          db: Number(process.env.REDIS_DB || 0)
      }),
      HttpModule.register({ global: true }),
      UsersModule,
      AuthModule,
      SkillsModule,
      ItemsModule,
      BadgesModule,
      ToDoModule,
      WalletsModule,
      DashboardsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
