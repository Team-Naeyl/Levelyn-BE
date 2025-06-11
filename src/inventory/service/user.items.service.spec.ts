import { Test, TestingModule } from '@nestjs/testing';
import { UserItemsService } from './user.items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserItem } from '../model';
import { Repository } from 'typeorm';
import { UpsertUserItemsDTO, UserItemDTO } from '../dto';
import random from "random";

jest.mock('typeorm-transactional', () => ({
    Transactional: () => () => ({}),
}));


const mockRepository = () => ({
    save: jest.fn(),
    findBy: jest.fn(),
    update: jest.fn(),
});

const userItemModel = (overrides = {}) => Object.assign({
    id: random.int(1),
    userId: 1,
    itemId: 1,
    equipped: false,
    item: { typeId: 100 },
    toDTO(): UserItemDTO {
        return {
            id: this.itemId,
            equipped: this.equipped,
            ...this.item
        } as UserItemDTO;
    }
}, overrides) as UserItem;

describe('UserItemsService', () => {
    let service: UserItemsService;
    let repo: Repository<UserItem>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserItemsService,
                {
                    provide: getRepositoryToken(UserItem),
                    useFactory: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UserItemsService>(UserItemsService);
        repo = module.get<Repository<UserItem>>(getRepositoryToken(UserItem));
    });

    describe('addUserItems', () => {
        it('should save user items and return DTOs', async () => {
           const userId = 1;
           const itemIds = [10, 20];

           const saved =
               itemIds.map(itemId => userItemModel({ userId, itemId }));

            (repo.save as jest.Mock).mockResolvedValue(saved);

            const results = await service.addUserItems({ userId, itemIds });
            expect(results).toHaveLength(2);
            expect(results.every((result, idx) => result.id === itemIds[idx]))
        });
    });

    describe('updateEquipped', () => {

        const ItemIdPred =
            (itemIds: number[]) => (ui: UserItem) => itemIds.includes(ui.itemId);

        const TypeIdPred
            = (typeIds: number[]) => (ui: UserItem) => typeIds.includes(ui.item.typeId);

        it('should update equipped status for items', async () => {
            const userId = 1;
            const itemIds = [1, 2];

            const userItems: UserItem[] = Array.from({ length: 8 })
                .map((_, i) => userItemModel({
                    equipped: i % 2 === 0 && i < 4,
                    itemId: i + 1,
                    item: { typeId: (i % 2) + 1 }
                }) as UserItem);

            (repo.findBy as jest.Mock)
                .mockResolvedValueOnce(userItems.slice(0, 2))
                .mockResolvedValueOnce(userItems.filter(ui => ui.equipped).filter(TypeIdPred([2])));

            (repo.update as jest.Mock).mockResolvedValue({ affected: itemIds.length });

            await expect(service.updateEquipped({ userId, itemIds })).resolves.toBeUndefined();
        });

        it('should throw error if update affects wrong number of rows', async () => {
            const dto: UpsertUserItemsDTO = { userId: 1, itemIds: [1, 2] };
            const userItems = [
                userItemModel({ equipped: false, item: { typeId: 1 } }),
            ];
            (repo.findBy as jest.Mock).mockResolvedValue(userItems);
            (repo.update as jest.Mock).mockResolvedValue({ affected: 0 });

            await expect(service.updateEquipped(dto)).rejects.toThrow('Query failed');
        });
    });
});
