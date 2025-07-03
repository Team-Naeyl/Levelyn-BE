import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { AddUserSkillsCommand } from "../command";
import { UserSkillsService } from "../service";
import { Inject, Logger } from "@nestjs/common";
import { UserSkillsAddedEvent } from "../event";

@CommandHandler(AddUserSkillsCommand)
export class AddUserSkillsHandler implements ICommandHandler<AddUserSkillsCommand> {
    private readonly _logger: Logger = new Logger(AddUserSkillsHandler.name);

    constructor(
        @Inject(UserSkillsService)
        private readonly _userSkillsService: UserSkillsService,
        @Inject(EventBus)
        private readonly _eventBus: EventBus,
    ) {}

    async execute(cmd: AddUserSkillsCommand): Promise<void> {

        await this._userSkillsService.addUserSkills(cmd)
            .then(skills => {
                skills.length && this._eventBus.publish(
                    new UserSkillsAddedEvent(
                        cmd.userId,
                        skills
                    )
                );
            })
            .catch(err => {
                this._logger.error(err);
            });

    }

}