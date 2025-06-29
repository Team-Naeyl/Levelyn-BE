import { Test, TestingModule } from '@nestjs/testing';
import { ItemTargetsService } from './item.targets.service';
import { ItemsService } from '../../game/items';

describe('ItemTargetsService', () => {
    let service: ItemTargetsService;
    let itemsService: ItemsService;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ItemTargetsService,
                {
                    provide: ItemsService,
                    useValue: { getAllItems: jest.fn() },
                },
            ],
        }).compile();

        service = module.get<ItemTargetsService>(ItemTargetsService);
        itemsService = module.get<ItemsService>(ItemsService);
    });

    it('Load all items, map them to item targets, and sum weights by scan', async () => {

        (itemsService.getAllItems as jest.Mock).mockResolvedValue([
            { id:  1, weight: 10 },
            { id: 2, weight: 5 },
            { id: 3, weight: 15 },
        ]);

        await expect(service.loadItemTargets()).resolves.toEqual([
            { itemId: 1, weight: 10 },
            { itemId: 2, weight: 15 },
            { itemId: 3, weight: 30 },
        ]);
    });
});