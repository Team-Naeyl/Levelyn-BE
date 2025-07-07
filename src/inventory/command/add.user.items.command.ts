import { UpsertUserItemsDTO, UserItemDTO } from "../dto";
import { Command } from "@nestjs/cqrs";

export class AddUserItemsCommand
    extends Command<UserItemDTO[]>
    implements UpsertUserItemsDTO
{
    readonly userId: number;
    readonly itemIds: number[];
    
    constructor(data: UpsertUserItemsDTO) {
        super();
        Object.assign(this, data);
    }
}