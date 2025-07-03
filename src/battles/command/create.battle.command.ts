import { Command } from "@nestjs/cqrs";

export class CreateBattleCommand extends Command<any> {
    constructor(public readonly userId: number) { super(); }
}