import { registerDecorator, ValidationOptions, ValidationArguments, } from 'class-validator';

export function IsRange(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsRange',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    return Array.isArray(value)
                        && value.length === 2
                        && value[0] < value[1];
                }
            },
        });
    };
}