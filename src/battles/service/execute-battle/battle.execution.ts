import { Battle, Mob, PlayerSkill, PlayerStat } from "../../schema";
import { Logger } from "@nestjs/common";
import { TurnResult } from "../../dto";

export class BattleExecution {
    private readonly _logger: Logger = new Logger(BattleExecution.name);
    private _curr: number = 0;

    constructor(
       private readonly _stat: PlayerStat,
       private readonly _skills: PlayerSkill[],
       private readonly _mob: Mob
    ) {}

    static createExecution(battle: Battle): BattleExecution {
        const { player: { stat, skills }, mob } = battle;
        return new BattleExecution(stat, skills, mob);
    }

    *executeTurn(): Iterable<TurnResult> {
        while (this._mob.hp) {
            const [attack, will] = this.applySkill();
            this._mob.hp = Math.max(this._mob.hp - attack, 0);
            yield this.turnResult(attack, will);
            this._curr = (++this._curr) % this._skills.length;
        }
    }

    get finished(): boolean {
        return !this._mob.hp;
    }

    private turnResult(attack: number, will: number): TurnResult {

        this._logger.log({
            attack, will,
            currentSkill: this.currentSkill(),
            mob: { hp: this._mob.hp }
        });

        return {
            skillId: this.currentSkill().id,
            damage: attack,
            mobHp: this._mob.hp
        }
    }

    private currentSkill(): PlayerSkill {
        return this._skills[this._curr];
    }

    private applySkill(): [number, number] {
        const skill = this.currentSkill();

        const attack = this._stat.attack * skill.attack;
        const will = this._stat.will * skill.will;

        return [attack, will];
    }


}