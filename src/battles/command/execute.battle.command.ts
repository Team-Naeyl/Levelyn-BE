import { Command } from "@nestjs/cqrs";
import { ExecuteBattleResult } from "../dto";

export class ExecuteBattleCommand extends Command<
    AsyncIterableIterator<ExecuteBattleResult>
> {
    constructor(public readonly id: string) { super(); }
}