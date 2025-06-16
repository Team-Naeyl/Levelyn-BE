import { registerDecorator, ValidationOptions, ValidationArguments, } from 'class-validator';

export function IsNotPast(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isNotPastDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    if (!(value instanceof Date) || isNaN(value.getTime())) {
                        return false;
                    }

                    const now = new Date();
                    now.setHours(0, 0, 0, 0); // normalize to start of day

                    const givenDate = new Date(value);
                    givenDate.setHours(0, 0, 0, 0);

                    return givenDate >= now;
                },
                defaultMessage(_args: ValidationArguments) {
                    return `${_args.property} must be a valid date that is not in the past`;
                },
            },
        });
    };
}