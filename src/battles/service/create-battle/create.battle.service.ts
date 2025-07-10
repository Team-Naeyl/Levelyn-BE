import { Inject, Injectable } from "@nestjs/common";
import { LoadPlayerService } from "./load.player.service";
import { LoadMobService } from "./load.mob.service";
import { Battle, BattlePenalty, BattleReward } from "../../schema";
import { ApplyItemsService } from "./apply.items.service";
import { CreateBattleDTO } from "../../dto";
import { BattlesRepository } from "../../battles.repository";

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
      @Inject(BattlesRepository)
      private readonly _battlesRepos: BattlesRepository
    ) {
        this._penaltyDuration = 3;
    }

    async createBattle(dto: CreateBattleDTO): Promise<Battle> {
        const { userId, position } = dto;

        const player = await this._playersService.loadPlayer(userId);
        const mob = await this._mobsService.loadMob(position);
        const reward = new BattleReward();
        const penalty = this.createBattlePenalty();

        await this._applyItemsService.applyEquippedItems(
            userId,
            player.stat,
            reward, penalty
        );

        return await this._battlesRepos.saveBattle({
            userId, player, mob, reward, penalty
        });
    }

    private createBattlePenalty(): BattlePenalty {
        return new BattlePenalty(this._penaltyDuration);
    }
}