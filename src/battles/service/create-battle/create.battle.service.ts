import { Inject, Injectable } from "@nestjs/common";
import { LoadPlayerService } from "./load.player.service";
import { LoadMobService } from "./load.mob.service";
import { BattleConfig } from "../../../game";
import { Battle, BattlePenalty, BattleReward } from "../../schema";
import { ApplyItemsService } from "./apply.items.service";
import Redis from "ioredis";

@Injectable()
export class CreateBattleService {
    private readonly _penaltyDuration: number;

    constructor(
      @Inject(LoadPlayerService)
      private readonly _playersService: LoadPlayerService,
      @Inject(LoadMobService)
      private readonly _mobsService: LoadMobService,
      @Inject(ApplyItemsService)
      private readonly _applyItemsService: ApplyItemsService,
      @Inject(Redis)
      private readonly _redis: Redis,
      @Inject(BattleConfig)
      { penaltyDuration }: BattleConfig
    ) {
        this._penaltyDuration = penaltyDuration;
    }

    async createBattle(userId: number): Promise<Battle> {
        const player = await this._playersService.loadPlayer(userId);
        const mob = await this._mobsService.loadMob(player.position);

        const battle = new Battle({
            userId, player, mob,
            reward: new BattleReward(),
            penalty: this.createBattlePenalty()
        });

        await this.applyItems(battle);
        await this.saveBattle(battle);

        return battle;
    }

    private createBattlePenalty(): BattlePenalty {
        return new BattlePenalty(this._penaltyDuration);
    }

    private async applyItems(battle: Battle) {
        await this._applyItemsService.applyEquippedItems(
            battle.userId,
            battle.player.stat,
            battle.reward,
            battle.penalty
        );
    }

    private async saveBattle(battle: Battle) {
        await this._redis.call(
            "JSON.SET",
            `battle:${battle.id}`,
            JSON.stringify(battle)
        );
    }
}