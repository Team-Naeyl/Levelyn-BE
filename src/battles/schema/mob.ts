import { MonsterDTO } from "../../game/monsters/dto";
import { TypeDTO } from "../../game/common";

export class Mob  {
    id: number;
    type: TypeDTO;
    name: string;
    hp: number;

    constructor(data: MonsterDTO) {
        Object.assign(this, data);
    }
}