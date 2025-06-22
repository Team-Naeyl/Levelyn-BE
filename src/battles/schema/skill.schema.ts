import { ObjectField } from "../../config/redis";

export class SkillSchema {
    @ObjectField({ type: "number" })
    id: number;

    @ObjectField({ type: "string" })
    name: string;

    @ObjectField({ type: "string" })
    description: string;

    @ObjectField({ type: "boolean" })
    global: boolean;

    @ObjectField({ type: "number" })
    attack: number;

    @ObjectField({ type: "number" })
    will: number;
}