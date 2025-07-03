import { Module } from "@nestjs/common";
import { RewardConfig } from "../game";
import { YamlConfigModule } from "../config/yaml-config";
import { ApplyRewardService, RewardsService } from "./service";

@Module({
    imports: [
        YamlConfigModule.forFeature([RewardConfig]),
    ],
    providers:[
       RewardsService,
       ApplyRewardService
    ]
})
export class RewardsModule {}