import { TypeDTO } from "../../game/common";

export interface MobDTO {
    id: number;
    type: TypeDTO;
    name: string;
    hp: number;
}