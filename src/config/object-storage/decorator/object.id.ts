import { applyDecorators } from "@nestjs/common";
import { ObjectFieldOptions } from "./object.field.options";
import { ObjectField } from "./object.field";

export function ObjectId(options: ObjectFieldOptions): PropertyDecorator {
    return applyDecorators(
        ObjectField(options),
        function (tg: any, propKey: string | symbol) {
            Reflect.defineMetadata("primary", true, tg, propKey);
        }
    );
}

