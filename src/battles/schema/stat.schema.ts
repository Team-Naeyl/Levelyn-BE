import { ObjectField } from "../../config/redis";


export class StatSchema {
    @ObjectField({ type: "number" })
    level: number;

    @ObjectField({ type: "number" })
    attack: number;

    @ObjectField({ type: "number" })
    will: number;
}