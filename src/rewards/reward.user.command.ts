import { RewardUserDTO } from "./dto";
import { ProbabilityBuffDTO } from "../game/random-boxes/dto";
import { Command } from "@nestjs/cqrs";

export class RewardUserCommand
    extends Command<void>
    implements RewardUserDTO
{
    readonly userId: number;
    readonly exp?: number;
    readonly coin?: number;
    readonly buff?: ProbabilityBuffDTO;

    constructor(data: RewardUserDTO) {
        super();
        Object.assign(this, data);
    }
}