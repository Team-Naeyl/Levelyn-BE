import { Test, TestingModule } from '@nestjs/testing';
import { PlayerItemsService } from './player.items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerItem } from '../model';
import { Repository } from 'typeorm';
import { UpsertPlayerItemsDTO, PlayerItemDTO } from '../dto';
import random from "random";
import { ItemEffect } from "../../game/items/model/item.effect.model";
import { Item } from "../../game";

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
    playerId: 1,
    itemId: 1,
    equipped: false,
    item: { typeId: 100 },
    toDTO(): PlayerItemDTO {
        return {
            id: this.itemId,
            equipped: this.equipped,
            ...this.item
        } as PlayerItemDTO;
    }
}, overrides) as PlayerItem;

describe('UserItemsService', () => {
    let service: PlayerItemsService;
    let repo: Repository<PlayerItem>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlayerItemsService,
                {
                    provide: getRepositoryToken(PlayerItem),
                    useFactory: mockRepository,
                },
            ],
        }).compile();

        service = module.get<PlayerItemsService>(PlayerItemsService);
        repo = module.get<Repository<PlayerItem>>(getRepositoryToken(PlayerItem));
    });

    describe('addUserItems', () => {
        it('should save user items and return DTOs', async () => {
           const userId = 1;
           const itemIds = [10, 20];

           const saved =
               itemIds.map(itemId => userItemModel({ userId, itemId }));

            (repo.save as jest.Mock).mockResolvedValue(saved);

            const results = await service.addPlayerItems({ playerId: userId, itemIds });
            expect(results).toHaveLength(2);
            expect(results.every((result, idx) => result.id === itemIds[idx]))
        });
    });

    describe('updateEquipped', () => {

        const ItemIdPred =
            (itemIds: number[]) => (ui: PlayerItem) => itemIds.includes(ui.itemId);

        const TypeIdPred
            = (typeIds: number[]) => (ui: PlayerItem) => typeIds.includes(ui.item.typeId);

        it('should update equipped status for items', async () => {
            const userId = 1;
            const itemIds = [1, 2];

            const userItems: PlayerItem[] = Array.from({ length: 8 })
                .map((_, i) => userItemModel({
                    equipped: i % 2 === 0 && i < 4,
                    itemId: i + 1,
                    item: { typeId: (i % 2) + 1 }
                }) as PlayerItem);

            (repo.findBy as jest.Mock)
                .mockResolvedValueOnce(userItems.slice(0, 2))
                .mockResolvedValueOnce(userItems.filter(ui => ui.equipped).filter(TypeIdPred([2])));

            (repo.update as jest.Mock).mockResolvedValue({ affected: itemIds.length });

            await expect(service.updateEquipped({ playerId: userId, itemIds })).resolves.toBeUndefined();
        });

        it('should throw error if update affects wrong number of rows', async () => {
            const dto: UpsertPlayerItemsDTO = { playerId: 1, itemIds: [1, 2] };

            const userItems = [
                userItemModel({ equipped: false, item: { typeId: 1 } }),
            ];

            (repo.findBy as jest.Mock).mockResolvedValue(userItems);
            (repo.update as jest.Mock).mockResolvedValue({ affected: 0 });

            await expect(service.updateEquipped(dto)).rejects.toThrow('Query failed');
        });
    });

    describe('getNetEquippedItemEffect', () => {
        it('should sum equipped item effects', async () => {

            const effects: ItemEffect[] = [
                { attack: 1, will: 2, exp: 10, coin: 20 },
                { attack: 3, will: 4, exp: 30, coin: 40 }
            ] as ItemEffect[];

            const userItems: PlayerItem[] = effects.map(effect => ({
                item: { effect: Promise.resolve(effect) } as Item
            })) as PlayerItem[];

            (repo.findBy as jest.Mock).mockResolvedValue(userItems);

            await expect(service.getNetEquippedItemEffect(1))
                .resolves
                .toEqual({ attack: 4, will: 6, exp: 40, coin: 60 });
        });
    });
});
