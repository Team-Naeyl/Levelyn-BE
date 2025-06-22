import { ObjectField } from "../../config/redis";

export class MonsterSchema {
    @ObjectField({ type: "number" })
    id: number;

    @ObjectField({ type: "string" })
    type: string;

    @ObjectField({ type: "string" })
    name: string;

    @ObjectField({ type: "number" })
    hp: number;

    @ObjectField({ type: "number" })
    physicalResistance: number;

    @ObjectField({ type: "number" })
    magicalResistance: number;
}