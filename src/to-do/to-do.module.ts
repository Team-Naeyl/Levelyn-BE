import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Goal, ToDo, ToDoPeriod } from "./model";
import { AuthModule, JwtAuthGuard } from "../auth";
import { FulfillToDoHandler, GoalsService, ToDoService } from "./service";
import { GoalsController, ToDoController } from "./controller";
import { OptionsProvider } from "../common";
import { IS_BATTLE_EVENT } from "./token";
import { Random } from "random";
import { BATTLE_EVENT_PROBABILITY, GameModule, RewardsService } from "../game";

const EXTERNAL_PROVIDERS = [JwtAuthGuard, RewardsService];

@Module({
    imports: [
        TypeOrmModule.forFeature([ToDo, ToDoPeriod, Goal]),
        AuthModule,
        GameModule
    ],
    providers: [
        ...EXTERNAL_PROVIDERS,
        ToDoService,
        GoalsService,
        FulfillToDoHandler,
        OptionsProvider<number>(BATTLE_EVENT_PROBABILITY),
        {
            provide: IS_BATTLE_EVENT,
            useFactory: (random: Random, p: number) => {
                const binomial = random.binomial(1, p);
                return () => Boolean(binomial());
            },
            inject: [Random, BATTLE_EVENT_PROBABILITY]
        }
    ],
    controllers: [ToDoController, GoalsController],
})
export class ToDoModule {}
