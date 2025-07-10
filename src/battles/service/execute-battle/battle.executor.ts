import { Battle, Mob, PlayerStat } from "../../schema";
import { SkillsQueue } from "./skills.queue";
import { ExecuteBattleResult } from "../../dto";

type __TurnResult = Omit<ExecuteBattleResult, "done">;

export class BattleExecutor {

    constructor(
       private readonly _stat: PlayerStat,
       private readonly _mob: Mob,
       private readonly _skillsQueue: SkillsQueue
    ) {}

    static createExecutor(battle: Battle): BattleExecutor {
        const { player: { stat, skills }, mob } = battle;
        return new BattleExecutor(stat, mob, new SkillsQueue(skills));
    }

    *execute(): IterableIterator<__TurnResult> {
        while (this._mob.hp) {
           const { id: skillId, attack } = this._skillsQueue.currentEffect();

           const damage = this._stat.attack * attack
           this._mob.hp = Math.max(this._mob.hp - damage, 0);

           yield { skillId, damage, mobHp: this._mob.hp  };
        }
    }

    get finished(): boolean {
        return !this._mob.hp;
    }
}