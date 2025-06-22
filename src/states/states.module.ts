import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserState } from "./model";
import { LevelUpService, UserStatesService } from "./service";
import { UserStatesListener } from "./user.states.listener";

@Module({
    imports: [TypeOrmModule.forFeature([UserState])],
    providers: [UserStatesListener, UserStatesService, LevelUpService]
})
export class StatesModule {}
