import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "./model";
import { WalletsService } from "./service/wallets.service";
import { UpdateWalletHandler } from "./handler";

@Module({
    imports: [TypeOrmModule.forFeature([Wallet])],
    providers: [
        WalletsService,
        UpdateWalletHandler
    ],
    exports: [WalletsService],
})
export class WalletsModule {}
