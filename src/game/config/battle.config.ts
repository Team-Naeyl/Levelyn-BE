import { ConfigField, ConfigSchema } from "../../config/yaml-config";

@ConfigSchema("BATTLE")
export class BattleConfig {
    @ConfigField({ path: "EXPIRES" })
    expires: number;
    @ConfigField({ path: "TURN_INTERVAL" })
    turnInterval: number;
}