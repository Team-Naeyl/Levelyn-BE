import { Inject, Injectable } from "@nestjs/common";
import { SkillsService } from "../../game";
import { UnlockSkillsDTO } from "../dto";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { map, pipe, prop, toArray } from "@fxts/core";
import { UserSkillsUnlockedEvent } from "../event";

@Injectable()
export class UnlockSkillsService {

    constructor(
        @Inject(SkillsService)
        private _skillsService: SkillsService,
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2
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

        this._eventEmitter.emit(
            `user.${userId}.skills.unlocked`,
            new UserSkillsUnlockedEvent(skillIds)
        );
    }
}