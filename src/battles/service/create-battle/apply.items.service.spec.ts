import { Test, TestingModule } from '@nestjs/testing';
import { ApplyItemsService } from './apply.items.service';
import { UserItemsService } from '../../../inventory';
import { BattlePenalty, BattleReward, Player, PlayerStat } from '../../schema';
import { ItemEffectDTO } from '../../../game/items/dto';

jest.mock('typeorm-transactional', () => ({
    Transactional: () => () => ({}),
}));

describe('ApplyItemsService', () => {
    let service: ApplyItemsService;
    let userItemsService: UserItemsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ApplyItemsService,
                {
                    provide: UserItemsService,
                    useValue: {
                        getNetEquippedItemEffect: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(ApplyItemsService);
        userItemsService = module.get(UserItemsService);
    });

    it('Apply item effects to stat, reward, and penalty as side effect', async () => {
        const userId = 1;

        const player: Player = { stat: { attack: 20, will: 25 } } as Player;
        const reward: BattleReward = new BattleReward();
        const penalty: BattlePenalty = new BattlePenalty(3);

        const effect: ItemEffectDTO = {
            attack: 2,
            will: 1,
            exp: 1.1,
            coin: 1.2,
            pCoin: 1.01,
            pItem: 1.03,
            penaltyDuration: -1
        };

        (userItemsService.getNetEquippedItemEffect as jest.Mock).mockResolvedValue(effect);
        await service.applyEquippedItems(userId, player.stat, reward, penalty);

        expect(player.stat).toEqual({ attack: 22, will: 26 });
        expect(reward).toEqual({ exp: 1.1, coin: 1.2, pCoin: 1.01, pItem: 1.03 });
        expect(penalty).toEqual({ penaltyDuration: 2 });
    });
});