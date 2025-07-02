export type RedisHMap<SchemaT extends Object>
    = Record<keyof SchemaT, string | null>;

export type RedisValueType = "string" | "number" | "boolean" | "datetime";

