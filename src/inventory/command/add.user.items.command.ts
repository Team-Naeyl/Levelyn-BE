import { UpsertUserItemsDTO } from "../dto";
import { Command } from "@nestjs/cqrs";

export class AddUserItemsCommand
    extends Command<void>
    implements UpsertUserItemsDTO
{
    readonly userId: number;
    readonly itemIds: number[];
    
    constructor(data: UpsertUserItemsDTO) {
        super();
        Object.assign(this, data);
    }
}