import { Inject, Injectable } from "@nestjs/common";
import { SkillsService } from "../../skills";
import { HandleLevelUpDTO } from "../dto";
import { map, pipe, prop, toArray } from "@fxts/core";
import { DELTA_ATTACK, DELTA_WILL } from "../../config/game.system";
import { Transactional } from "typeorm-transactional";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class LevelUpService {

    constructor(
        @Inject(SkillsService)
        private readonly _skillsService: SkillsService,
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2
    ) {}

    @Transactional()
    async handleLevelUp(dto: HandleLevelUpDTO): Promise<void> {
        const userId = dto.userId;

        const skillIds = pipe(
           await this._skillsService.getSkillsBy({
               minLevel: dto.level,
               minAttack: [dto.attack - DELTA_ATTACK - 1, dto.attack],
               minWill: [dto.will - DELTA_WILL - 1, dto.will]
           }),
           map(prop("id")),
           toArray
        );

        this._eventEmitter.emit("add.user.items", { userId, skillIds });
    }
}