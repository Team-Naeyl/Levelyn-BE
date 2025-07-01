import { ConfigField, ConfigSchema } from "../../config/yaml-config";

@ConfigSchema("TILE")
export class TileConfig {
    @ConfigField({ path: "BATTLE_EVENT_PROBABILITY" })
    pBattleEvent: number;
}