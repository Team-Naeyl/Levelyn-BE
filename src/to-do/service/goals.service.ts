import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Goal } from "../model";
import { Repository } from "typeorm";
import { CreateGoalDTO, GoalDTO, ToDoDTO, UpdateGoalDTO } from "../dto";
import { isNull, pipe, throwIf } from "@fxts/core";
import { Transactional } from "typeorm-transactional";
import { ToDoService } from "./to-do.service";
import { isAfter } from "date-fns";
import { normalizedDifference } from "./service.internal";
import { excludeTimestamp } from "../../common";

@Injectable()
export class GoalsService {

    constructor(
        @InjectRepository(Goal)
        private readonly _goalsRepos: Repository<Goal>,
        @Inject(forwardRef(() => ToDoService))
        private readonly _toDoService: ToDoService
    ) {  }

    async createGoal(dto: CreateGoalDTO) {
        await this._goalsRepos.save(dto);
    }

    async getCurrentGaol(userId: number): Promise<GoalDTO | null> {
        return pipe(
            await this._goalsRepos.findOneBy({ userId }),
            g => g && excludeTimestamp(g, "userId")
        );
    }

    async updateGoal(dto: UpdateGoalDTO) {
        const { userId, ...values } = dto;
        await this._goalsRepos.update(userId, values);
    }

    @Transactional()
    async deleteGoal(userId: number) {
        await this._goalsRepos.delete(userId);
        await this._toDoService.onGoalDeleted(userId);
    }

    @Transactional()
    async onUpsertSubToDo(userId: number, { date, period }: ToDoDTO): Promise<void> {

        const { since, until } = pipe(
            await this._goalsRepos.findOneBy({ userId }),
            throwIf(isNull, () => new NotFoundException())
        );

        if (isAfter(date, until)) throw new ConflictException();

        if (isAfter(since, date)) {
            if (!period) throw new ConflictException();

            const d1 = normalizedDifference(since, date, period.unit);
            const d2 = normalizedDifference(until, date, period.unit);

            if (d1 > Math.floor(d2 / period.amount))
                throw new ConflictException();
        }
    }
}

