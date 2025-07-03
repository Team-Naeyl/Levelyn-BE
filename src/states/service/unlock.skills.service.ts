import { Inject, Injectable } from "@nestjs/common";
import { SkillsService } from "../../game";
import { UnlockSkillsDTO } from "../dto";
import { CommandBus } from "@nestjs/cqrs";
import { pipe, prop, map, toArray } from "@fxts/core";
import { AddUserSkillsCommand } from "../../inventory/command";

@Injectable()
export class UnlockSkillsService {

    constructor(
        @Inject(SkillsService)
        private _skillsService: SkillsService,
        @Inject(CommandBus)
        private readonly _commandBus: CommandBus,
    ) {}

    async unlockSKills(dto: UnlockSkillsDTO): Promise<void> {
       const { userId, level, attack, deltaAttack, will, deltaWill } = dto;

       const skillIds = pipe(
           await this._skillsService.getSkillsByRequirement({
               minLevel: level,
               minAttack: [attack - deltaAttack + 1, attack],
               minWill: [will - deltaWill + 1, will]
           }),
           map(prop("id")),
           toArray
       );

       await this._commandBus.execute(
           new AddUserSkillsCommand({
               userId, skillIds
           })
       );
    }


}

