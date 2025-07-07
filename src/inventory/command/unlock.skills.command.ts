import { Command } from "@nestjs/cqrs";
import { SkillDTO } from "../../game/skills/dto";

interface IUnlockSkillsCommand {
    userId: number;
    level: number;
    attack: number;
    deltaAttack: number;
    will: number;
    deltaWill: number;
}

export class UnlockSkillsCommand extends Command<SkillDTO[]> {
    readonly userId: number;
    readonly level: number;
    readonly attack: number;
    readonly deltaAttack: number;
    readonly will: number;
    readonly deltaWill: number;

    constructor(data: IUnlockSkillsCommand) {
        super();
        Object.assign(this, data);
    }
}