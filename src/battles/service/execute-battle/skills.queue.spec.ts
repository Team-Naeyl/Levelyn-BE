import { SkillsQueue } from './skills.queue';
import { PlayerSkill } from '../../schema';
import { cycle, each, pipe, take } from "@fxts/core";

describe('SkillsQueue', () => {
    it('should return default values when no skills are present', () => {
        const queue = new SkillsQueue([]);

        for (let i = 0; i !== 100; i++)
            expect(queue.currentEffect()).toEqual({ id: -1, attack: 1, will: 1, });
    });

    it('should cycle through skills correctly', () => {
        const skills: PlayerSkill[] = [
            { id: 11, attack: 2, will: 3 },
            { id: 19, attack: 4, will: 5 },
            { id: 27, attack: 6, will: 7 }
        ] as PlayerSkill[];

        const queue = new SkillsQueue(skills);

        pipe(
            cycle(skills),
            take(15),
            each(skill => {
                expect(queue.currentEffect()).toEqual(skill);
            })
        );
    });

    it('should handle a single skill and always return it', () => {
        const skills: PlayerSkill[] = [{ id: 1, attack: 7, will: 8 }] as PlayerSkill[];
        const queue = new SkillsQueue(skills);

        for (let i = 0; i !== 100; i++)
            expect(queue.currentEffect()).toEqual(skills[0]);
    });
});