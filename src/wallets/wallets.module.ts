import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "./model";
import { WalletsService } from "./service/wallets.service";
import { WalletsController } from './wallets.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Wallet])],
    providers: [WalletsService],
    controllers: [WalletsController],
    exports: [WalletsService],
})
export class WalletsModule {}
