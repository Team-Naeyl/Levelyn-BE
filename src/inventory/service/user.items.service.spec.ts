import { Test, TestingModule } from '@nestjs/testing';
import { UserItemsService } from './user.items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserItem } from '../model';
import { Repository } from 'typeorm';

describe('UserItemsService', () => {
    let service : UserItemsService;
    let userItemsReposMock: Repository<UserItem>;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserItemsService,
                {
                    provide: getRepositoryToken(UserItem),
                    useFactory: () => ({
                        save: jest.fn(),
                        findBy: jest.fn(),
                        update: jest.fn(),
                    })
                },
            ],
        }).compile();

        service = module.get<UserItemsService>(UserItemsService);
        userItemsReposMock = module.get<Repository<UserItem>>(getRepositoryToken(UserItem));
    });

    describe('addUserItems', () => {
        it('Save user items and return DTOs', async () => {
           const userId = 1;
           const itemIds = [10, 20];

           const saved: UserItem[] = itemIds.map(itemId => ({ userId, itemId }))
               .map(dto => ({
                   id: Math.floor(Math.random() * 1000),
                   ...dto,
                   equipped: false,
                   item: { id: dto.itemId },
                   toDTO: jest.fn().mockReturnValue({
                       id: dto.itemId,
                       equipped: false
                   })
               }) as unknown as UserItem);

            (userItemsReposMock.save as jest.Mock).mockResolvedValue(saved);
            const results = await service.addUserItems({ userId, itemIds });

            expect(results.length).toBe(itemIds.length);
            expect(results.map(ui => ui.id)).toEqual(itemIds);
            expect(results.every(ui => !ui.equipped)).toBe(true);
        });


    });

    describe("getUserItems", () => {




    })
});
