import { Command } from "@nestjs/cqrs";
import { UpdateStateDTO } from "./dto";

export class UpdateStateCommand
    extends Command<void>
{
    readonly id: number;
    readonly deltaExp: number;

    constructor(data: UpdateStateDTO) {
        super();
        Object.assign(this, data);
    }
}