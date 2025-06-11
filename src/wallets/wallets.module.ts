import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "./model";

@Module({
    imports: [TypeOrmModule.forFeature([Wallet])],
})
export class WalletsModule {}
