import { Test, TestingModule } from '@nestjs/testing';
import { UserSkillsService } from './user.skills.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSkill } from '../model';
import { UpsertUserSkillsDTO, UserSkillDTO } from '../dto';

jest.mock('typeorm-transactional', () => ({
    Transactional: () => () => ({}),
}));

describe('PlayerSkillsService', () => {
    let service: UserSkillsService;
    let repo: Repository<UserSkill>;

    const mockRepo = {
        save: jest.fn(),
        findBy: jest.fn(),
        update: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserSkillsService,
                {
                    provide: getRepositoryToken(UserSkill),
                    useValue: mockRepo,
                },
            ],
        }).compile();

        service = module.get<UserSkillsService>(UserSkillsService);
        repo = module.get<Repository<UserSkill>>(getRepositoryToken(UserSkill));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add player skills', async () => {
        const dto: UpsertUserSkillsDTO = { userId: 1, skillIds: [10, 20] };
        const savedSkills = [
            { id: 1, playerId: 1, skillId: 10, skill: {} },
            { id: 2, playerId: 1, skillId: 20, skill: {} },
        ];
        mockRepo.save.mockResolvedValue(savedSkills);

        const result = await service.addUserSkills(dto);
        expect(mockRepo.save).toHaveBeenCalled();
        expect(result).toHaveLength(2);
    });

    it('should get player skills', async () => {
        const playerSkills = [
            { id: 1, playerId: 1, skillId: 10, equipped: false, skill: {} },
        ];
        mockRepo.findBy.mockResolvedValue(playerSkills);

        const result = await service.getUserSkills(1);
        expect(mockRepo.findBy).toHaveBeenCalled();
        expect(result[0]).toHaveProperty('equipped');
    });

    it('should get equipped skills with effect', async () => {
        const skill = {
            effect: Promise.resolve({ attack: 1, will: 2, id: 99 }),
        };
        const playerSkills = [{ skill }];
        mockRepo.findBy.mockResolvedValue(playerSkills);

        const result = await service.getEquippedSkills(1);
        expect(Array.isArray(result)).toBe(true);
    });

    it('should update equipped skills', async () => {
        const skillsOld = [
            { id: 1, equipped: true, skillId: 100, skill: {} },
        ];
        const skillsNew = [
            { id: 2, equipped: false, skillId: 101, skill: {} },
        ];
        mockRepo.findBy
            .mockResolvedValueOnce(skillsOld)
            .mockResolvedValueOnce(skillsNew);
        mockRepo.update.mockResolvedValue({ affected: 2 });

        const dto: UpsertUserSkillsDTO = { userId: 1, skillIds: [101] };
        await service.updateEquipped(dto);

        expect(mockRepo.update).toHaveBeenCalled();
    });
});
