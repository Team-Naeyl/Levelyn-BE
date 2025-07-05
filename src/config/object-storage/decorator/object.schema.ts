import { SchemaConstructor } from "../types";

export function ObjectSchema(schemaName?: string) {
    return function<SchemaT extends Object> (
        Schema: SchemaConstructor<SchemaT>
    ) {

        Reflect.defineMetadata(
            "schemaName",
            schemaName ?? Schema.name,
            Schema
        );

        return Schema;
    };
}
