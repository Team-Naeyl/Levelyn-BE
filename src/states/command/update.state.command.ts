import { Command } from "@nestjs/cqrs";
import { UpdateStateDTO } from "../dto";

export class UpdateStateCommand
    extends Command<void>
    implements UpdateStateDTO
{
    readonly id: number;
    readonly deltaExp: number;
    readonly deltaPosition: number;

    constructor(data: UpdateStateDTO) {
        super();
        Object.assign(this, data);
    }
}