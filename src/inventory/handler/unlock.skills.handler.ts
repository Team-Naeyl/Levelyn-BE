import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UnlockSkillsCommand } from "../command";
import { Inject, Logger } from "@nestjs/common";
import { SkillsService } from "../../game";
import { UserSkillsService } from "../service";
import { map, pipe, prop, toArray } from "@fxts/core";
import { SkillDTO } from "../../game/skills/dto";

@CommandHandler(UnlockSkillsCommand)
export class UnlockSkillsHandler implements ICommandHandler<UnlockSkillsCommand> {
    private readonly _logger: Logger = new Logger(UnlockSkillsHandler.name);

    constructor(
        @Inject(SkillsService)
        private readonly _skillsService: SkillsService,
        @Inject(UserSkillsService)
        private readonly _userSkillsService: UserSkillsService,
    ) {}

    async execute(cmd: UnlockSkillsCommand): Promise<SkillDTO[]> {
        this._logger.log(cmd);
        const{ userId, level, attack, deltaAttack, will, deltaWill } = cmd;

        return pipe(
            await this._skillsService.getSkillsByRequirement({
                minLevel: level,
                minAttack: [attack - deltaAttack + 1, attack],
                minWill: [will - deltaWill + 1, will]
            }),
            map(prop("id")),
            toArray,
            skillIds => this._userSkillsService.addUserSkills({ userId, skillIds })
        );
    }

}