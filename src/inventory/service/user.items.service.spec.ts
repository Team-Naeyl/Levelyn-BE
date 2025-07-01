import { Test, TestingModule } from '@nestjs/testing';
import { UserItemsService } from './user.items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserItem } from '../model';
import { Repository } from 'typeorm';
import { UpsertUserItemsDTO, GetUserItemsDTO } from '../dto';
import { ItemEffectDTO } from '../../game/items/dto';

jest.mock('typeorm-transactional', () => ({
    Transactional: () => () => ({}),
}));

describe('PlayerItemsService', () => {
    let service: UserItemsService;
    let repos: Repository<UserItem>;

    const mockRepo = {
        save: jest.fn(),
        findBy: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserItemsService,
                {
                    provide: getRepositoryToken(UserItem),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get<UserItemsService>(UserItemsService);
        repos = module.get<Repository<UserItem>>(getRepositoryToken(UserItem));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Compute net equipped item effect', async () => {
        const effect: ItemEffectDTO = { attack: 5, will: 3, exp: 2, pItem: 1, pCoin: 1, penaltyDuration: 0 };
        const nItems = 10;

        const equippedItems: UserItem[] = Array.from({ length: nItems })
            .map((_, i) => ({
                item: { effect: Promise.resolve(effect) }
            }) as UserItem);

        (repos.findBy as jest.Mock).mockResolvedValue(equippedItems);

        await expect(service.getNetEquippedItemEffect(1)).resolves.toEqual(
            Object.fromEntries(
                Object.entries(effect)
                    .map(([k, v]) => [k, nItems * v])
            )
        )
    });

    it('should update equipped items', async () => {
        const items = [
            { id: 1, itemId: 100, equipped: false, item: { typeId: 200 } },
        ];
        const equippedItems = [
            { id: 2, itemId: 101, equipped: true, item: { typeId: 200 } },
        ];
        mockRepo.findBy
            .mockResolvedValueOnce(items)
            .mockResolvedValueOnce(equippedItems);
        mockRepo.update.mockResolvedValue({ affected: 2 });

        const dto: UpsertUserItemsDTO = { userId: 1, itemIds: [100] };
        await service.updateEquipped(dto);

        expect(mockRepo.update).toHaveBeenCalled();
    });
});