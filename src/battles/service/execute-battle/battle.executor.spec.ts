import { BattleExecutor } from './battle.executor';
import { Battle, PlayerSkill, PlayerStat } from '../../schema';
import { Logger } from '@nestjs/common';

describe('BattleExecution', () => {
    const mockLoggerLog = jest.spyOn(Logger.prototype, 'log').mockImplementation();

    const stat: PlayerStat = { attack: 2, will: 1, };

    const skills: PlayerSkill[] = [];

    const createBattle = (hp: number): Battle => {
      return { player: { stat, skills }, mob: { hp } } as Battle;
    };

    it('should execute turns until the mob is defeated', () => {
        const battle = createBattle(5);
        const execution = BattleExecutor.createExecutor(battle);
        const results = [...execution.execute()];

        expect(results.length).toBe(3);
        expect(results.at(-1)?.mobHp).toBe(0);
        expect(execution.finished).toBe(true);
    });

    it('should cycle through skills correctly', () => {
        const battle = createBattle(20);
        const execution = BattleExecutor.createExecutor(battle);
        const ids: number[] = [];

        for (const result of execution.execute()) {
            ids.push(result.skillId);
        }

        expect(new Set(ids).size).toBeLessThanOrEqual(skills.length);
    });
});