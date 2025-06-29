import { Inject, Injectable } from "@nestjs/common";
import { LevelConfig } from "../../game";
import { PlayerDTO } from "../dto";

@Injectable()
export class LevelUpService {

    constructor(
        @Inject(LevelConfig)
        private readonly _levelConfig: LevelConfig
    ) {}

    levelUpIfQualified(stats: PlayerDTO): PlayerDTO {

        if (stats.exp >= this._levelConfig.maxExp) {
            stats.exp -= this._levelConfig.maxExp;
            ++stats.level;
            stats.attack += this._levelConfig.deltaAttack;
            stats.will += this._levelConfig.deltaWill;
        }

        return stats;
    }
}