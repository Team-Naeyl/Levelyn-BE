import { EquippedSkillDTO } from "../../inventory/dto";

export class PlayerSkill implements EquippedSkillDTO {
    id: number;
    name: string;
    description: string;
    global: boolean;
    attack: number;
    will: number;

    constructor(data: EquippedSkillDTO) {
        Object.assign(this, data);
    }
}