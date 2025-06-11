import { Module } from '@nestjs/common';
import { UsersModule } from './users';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "node:path";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "./config/redis";
import { HttpModule } from "@nestjs/axios";
import { SkillsModule } from './skills';
import { ItemsModule } from './items';
import { BadgesModule } from './badges/badges.module';
import { ToDoModule } from './to-do';
import { WalletsModule } from './wallets';
import { DashboardsModule } from './dashboards';
import { typeormOptionsFactory, typeormDataSourceFactory } from "./config/typeorm";
import { GoalsModule } from './goals/goals.module';
import { InventoryModule } from './inventory/inventory.module';
import { EventEmitterModule } from "@nestjs/event-emitter";
import { RewardsModule } from './rewards';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: join(__dirname, "..", ".env")
      }),
      TypeOrmModule.forRootAsync({
          useFactory: typeormOptionsFactory,
          dataSourceFactory: typeormDataSourceFactory,
          inject: [ConfigService]
      }),
      RedisModule.forRootAsync(),
      HttpModule.register({ global: true }),
      EventEmitterModule.forRoot({ global: true }),
      UsersModule,
      AuthModule,
      SkillsModule,
      ItemsModule,
      BadgesModule,
      ToDoModule,
      WalletsModule,
      DashboardsModule,
      GoalsModule,
      InventoryModule,
      RewardsModule
  ]
})
export class AppModule {}
