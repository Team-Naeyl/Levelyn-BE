import { RedisValueType } from "./redis";

export type SchemaConstructor<SchemaT extends Object>
    = { new (...args: any[]): SchemaT };

export type SchemaInstanceType<Schema extends SchemaConstructor<any>>
    = Schema extends SchemaConstructor<infer SchemaT> ? SchemaT : never;

export type SchemaKeyType<SchemaT extends Object> = Extract<keyof SchemaT, string>;

export type SchemaConfig<SchemaT extends Object> = {
    [k in SchemaKeyType<SchemaT>]: RedisValueType;
};
