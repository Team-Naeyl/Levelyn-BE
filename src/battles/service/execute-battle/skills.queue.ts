import { PlayerSkill } from "../../schema";
import { pick } from "@fxts/core";

type __SKillEffect = Pick<PlayerSkill, "id" | "attack" | "will">;

export class SkillsQueue {
    private static readonly _DefaultEffect: __SKillEffect = { id: -1, attack: 1, will: 1, };
    private _curr: number = 0;
    private readonly _effects: __SKillEffect[];

    constructor(skills: PlayerSkill[]) {
        this._effects = skills.map(skill =>
            pick(["id", "attack", "will"], skill)
        );
    }

    currentEffect(): __SKillEffect {
        let effect = SkillsQueue._DefaultEffect;

        if (this._effects.length) {
            effect = this._effects[this._curr];
            this._curr = (++this._curr) % this._effects.length;
        }

        return effect;
    }
}

