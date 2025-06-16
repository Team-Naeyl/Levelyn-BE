import { Test, TestingModule } from '@nestjs/testing';
import { GoalsService } from './goals.service';
import { ToDoService } from './to-do.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Goal } from '../model';
import { ConflictException } from '@nestjs/common';
import { add, subDays } from 'date-fns';
import { ToDoDTO } from "../dto";

jest.mock('typeorm-transactional', () => ({
    Transactional: () => () => ({}),
}));

describe('GoalsService', () => {
    let service: GoalsService;
    let goalsRepos: jest.Mocked<Repository<Goal>>;
    let toDoService: jest.Mocked<ToDoService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GoalsService,
                {
                    provide: getRepositoryToken(Goal),
                    useValue: {
                        save: jest.fn(),
                        findOneBy: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: ToDoService,
                    useValue: {
                        onGoalDeleted: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(GoalsService);
        goalsRepos = module.get(getRepositoryToken(Goal));
        toDoService = module.get(ToDoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onUpsertSubToDo', () => {
        it('Throw ConflictException if goal not found', async () => {
            const toDoDTO: ToDoDTO = { date: new Date(), period: { unit: 'days', amount: 1 } } as ToDoDTO;
            goalsRepos.findOneBy.mockResolvedValue(null);
            await expect(service.onUpsertSubToDo(1, toDoDTO)).rejects.toThrow(ConflictException);
        });

        it('Throw ConflictException if date is after until', async () => {
            const now = new Date();
            const toDoDTO = { date: now, period: { unit: 'days', amount: 1 } } as ToDoDTO;
            const until = subDays(now, 3);
            const since = subDays(now, 5);
            goalsRepos.findOneBy.mockResolvedValue({ since, until } as Goal);
            await expect(service.onUpsertSubToDo(1, toDoDTO)).rejects.toThrow(ConflictException);
        });

        it('Throw ConflictException if since is after date and period is null', async () => {
            const now = new Date();
            const since = add(now, { days: 1 });
            const until = add(now, { days: 2 });

            goalsRepos.findOneBy.mockResolvedValue({ since, until } as Goal);

            await expect(service.onUpsertSubToDo(1, { date: now, period: null } as ToDoDTO))
                .rejects.toThrow(ConflictException);
        });

        it('should not throw if conditions are valid', async () => {
            const now = new Date();
            const since = add(now, { days: -1 });
            const until = add(now, { days: 2 });
            goalsRepos.findOneBy.mockResolvedValue({ since, until } as Goal);

            await expect(
                service.onUpsertSubToDo(1, { date: now, period: { unit: 'days', amount: 1 } } as ToDoDTO)
            ).resolves.toBeUndefined();
        });
    });
});