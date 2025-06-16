import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeormOptionsFactory, typeormDataSourceFactory } from "./config/typeorm";
import { RedisModule } from "./config/redis";
import { HttpModule } from "@nestjs/axios";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { UsersModule } from './users';
import { AuthModule } from './auth';
import { SkillsModule } from './skills';
import { ItemsModule } from './items';
import { ToDoModule } from './to-do';
import { WalletsModule } from './wallets';
import { DashboardsModule } from './dashboards';
import { InventoryModule } from './inventory';
import { RewardsModule } from './rewards';
import { StatsModule } from './stats/stats.module';
import yamlConfig from "./config/yaml";
import { join } from "node:path";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: join(__dirname, "..", ".env"),
        load: [yamlConfig]
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
      ToDoModule,
      WalletsModule,
      DashboardsModule,
      InventoryModule,
      RewardsModule,
      StatsModule
  ]
})
export class AppModule {}
