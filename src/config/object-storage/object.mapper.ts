import { RedisHMap, RedisValueType, SchemaConstructor, SchemaKeyType } from "./types";
import { getSchemaConfig } from "./reflection";
import { entries } from "@fxts/core";

export class ObjectMapper<SchemaT extends Object> {
    private readonly _config: [SchemaKeyType<SchemaT>, RedisValueType][];

    constructor(
        private readonly _Schema: SchemaConstructor<SchemaT>
    ) {
        this._config = [...entries(getSchemaConfig(this._Schema))];

    }

    async hMapToInstance(hMap: RedisHMap<SchemaT>): Promise<SchemaT> {
        const instance = new this._Schema();

        for (const [k, type] of this._config) {
            const v = hMap[k];

            switch (type) {
                case "string":
                    instance[k] = v as any;
                    break;
                case "number":
                    instance[k] = Number(v) as any;
                    break;
                case "boolean":
                    instance[k] = Boolean(Number(v)) as any;
                    break;
                case "datetime":
                    instance[k] = new Date(v!) as any;
                    break;
            }
        }

        return instance;
    }

    instanceToHMap(instance: Partial<SchemaT>): RedisHMap<SchemaT> {
        return Object.fromEntries(
            this._config
                .filter(([k,]) => instance[k] !== undefined)
                .map(([k, type]) =>
                    [k, __toRedisValue(instance[k], type)]
                )
        ) as RedisHMap<SchemaT>;
    }
}

function __toRedisValue(x: any, type: RedisValueType): string {
    switch (type) {
        case "boolean":
            return Number(x).toString();
        case "datetime" : {
            return (x instanceof Date ? x : new Date(x)).toISOString();
        }
        default:
            return String(x);
    }
}