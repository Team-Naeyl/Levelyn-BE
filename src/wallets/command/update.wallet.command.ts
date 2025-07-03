import { Command } from "@nestjs/cqrs";
import { UpdateWalletDTO } from "../dto";

export class UpdateWalletCommand
    extends Command<void>
    implements UpdateWalletDTO
{
    readonly id: number;
    readonly deltaCoin: number;

    constructor(data: UpdateWalletDTO) {
        super();
        Object.assign(this, data);
    }
}