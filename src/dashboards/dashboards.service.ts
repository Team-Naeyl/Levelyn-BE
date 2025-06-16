import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Dashboard, Level } from "./model";
import { Repository } from "typeorm";
import { isNull, pipe, throwIf } from "@fxts/core";
import { DashboardDTO, UpdateExpDTO } from "./dto";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class DashboardsService {

    constructor(
        @InjectRepository(Dashboard)
        private readonly _dashboardsRepos: Repository<Dashboard>,
        @InjectRepository(Level)
        private readonly _levelsRepos: Repository<Level>,
    ) {}

    async getDashBoard(id: number): Promise<DashboardDTO> {
        return pipe(
            await this._dashboardsRepos.findOneBy({ id }),
            throwIf(isNull, () => new NotFoundException()),
            dashboard => dashboard.toDTO()
        );
    }

    @Transactional()
    async updateExp(dto: UpdateExpDTO) {
        const { id, deltaExp } = dto;

        const dashboard = pipe(
            await this._dashboardsRepos.findOneBy({ id }),
            throwIf(isNull, () => new NotFoundException())
        );


    }

    @Transactional()
    private async levelUp(dashboard: Dashboard): Promise<void> {

        const nextLevel = await this._levelsRepos
            .findOneBy({ id: dashboard.levelId + 1 });

        if  (nextLevel) {
            dashboard.levelId = nextLevel.id;

        }

    }
}