import { UpsertUserSkillsDTO } from "../dto";
import { Command } from "@nestjs/cqrs";

export class AddUserSkillsCommand
    extends Command<void>
    implements UpsertUserSkillsDTO {
    readonly userId: number;
    readonly skillIds: number[];

    constructor(data: UpsertUserSkillsDTO) {
        super();
        Object.assign(this, data);
    }
}