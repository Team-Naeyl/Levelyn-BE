import { ConfigField, ConfigSchema } from "../../config/yaml-config";

@ConfigSchema("REWARD")
export class RewardConfig {
   @ConfigField({ path: "EXP_REWARD" })
   exp: number;

   @ConfigField({ path: "ITEM_REWARD_PROBABILITY" })
   pItem: number;

   @ConfigField({ path: "COIN_REWARD_PROBABILITY" })
   pCoin: number;

   @ConfigField({ path: "COIN_DISTRIBUTION_LAMBDA" })
   lambdaCoin: number;
}