import { ConfigField, ConfigSchema } from "../../config/yaml-config";

@ConfigSchema("BATTLE")
export class BattleConfig {
    @ConfigField({ path: "DURATION" })
    duration: number;

}