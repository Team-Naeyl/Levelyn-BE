import { Module } from "@nestjs/common";
import { GameModule, RandomBoxesService, RewardConfig } from "../game";
import { YamlConfigModule } from "../config/yaml-config";
import { ApplyRewardService, RewardsService } from "./service";
import { RewardUserHandler } from "./reward.user.handler";

const EXTERNAL_PROVIDERS = [RandomBoxesService];

@Module({
    imports: [
        YamlConfigModule.forFeature([RewardConfig]),
        GameModule
    ],
    providers:[
        ...EXTERNAL_PROVIDERS,
        RewardsService,
        ApplyRewardService,
        RewardUserHandler
    ]
})
export class RewardsModule {}