import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserItemsService, UserSkillsService } from "./service";
import { OnEvent } from "@nestjs/event-emitter";
import { UpsertUserItemsDTO, UpsertUserSkillsDTO } from "./dto";

@Injectable()
export class InventoryListener {
    private readonly _logger: Logger = new Logger(InventoryListener.name);

    constructor(
        @Inject(UserItemsService)
        private readonly _userItemsService: UserItemsService,
        @Inject(UserSkillsService)
        private readonly _userSkillsService: UserSkillsService
    ) {}

    @OnEvent("add.user.items")
    async addUserItems(dto: UpsertUserItemsDTO): Promise<void> {
        await this._userItemsService.addUserItems(dto)
            .catch(err => this._logger.error(err));
    }

    @OnEvent("add.user.skills")
    async addUserSkills(dto: UpsertUserSkillsDTO): Promise<void> {
        await this._userSkillsService.addUserSkills(dto)
            .catch(err => this._logger.error(err));
    }
}