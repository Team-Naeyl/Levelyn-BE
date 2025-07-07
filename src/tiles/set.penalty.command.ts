import { Command } from "@nestjs/cqrs";

export class SetPenaltyCommand extends Command<any>{
    constructor(
       public readonly id: number,
       public readonly penaltyCount: number,
    ) { super(); }
}