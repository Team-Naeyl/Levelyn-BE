import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserState } from "./model";
import { LevelUpService, UserStatesService } from "./service";
import { StatesListener } from "./states.listener";

@Module({
    imports: [TypeOrmModule.forFeature([UserState])],
    providers: [StatesListener, UserStatesService, LevelUpService]
})
export class StatesModule {}
