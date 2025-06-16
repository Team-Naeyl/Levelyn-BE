import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ToDo } from "../model";
import { LessThanOrEqual, Repository } from "typeorm";
import { CreateToDoDTO, FulfillToDoDTO, GetDailyToDoListDTO, UpdateToDoDTO, DeleteToDoDTO, ToDoDTO } from "../dto";
import { filter, isNull, map, omit, pipe, throwIf, toArray } from "@fxts/core";
import { add } from "date-fns";
import { Transactional } from "typeorm-transactional";
import { FulfilledToDoService } from "./fulfilled.to-do.service";
import { isDayToDo } from "./service.internal";
import { GoalsService } from "./goals.service";

@Injectable()
export class ToDoService {
    private readonly _logger: Logger = new Logger(ToDoService.name);

    constructor(
       @InjectRepository(ToDo)
       private readonly _toDoRepos: Repository<ToDo>,
       @Inject(forwardRef(() => GoalsService))
       private readonly _goalsService: GoalsService,
       @Inject(FulfilledToDoService)
       private readonly _fulfilledService: FulfilledToDoService
    ) {}

    @Transactional()
    async createToDo(dto: CreateToDoDTO): Promise<void> {
        const toDo = await this._toDoRepos.save(dto);
        toDo.isSub && await this._goalsService.onUpsertSubToDo(toDo.userId, toDo.toDTO());
    }

    async getDailyToDoList(dto: GetDailyToDoListDTO): Promise<ToDoDTO[]> {
        const { userId, date } = dto;

        return pipe(
            await this._toDoRepos.findBy({ userId, date: LessThanOrEqual(date) }),
            map(toDo => toDo.toDTO()),
            filter(toDo => isDayToDo(date, toDo)),
            toArray
        );
    }

    @Transactional()
    async updateToDo(dto: UpdateToDoDTO): Promise<void> {
        const { id, userId, ...values } = dto;

        values.isSub && await pipe(
            await this._toDoRepos.findOneBy({ id, userId }),
            throwIf(isNull, () => new NotFoundException()),
            async toDo => toDo.isSub || await this._goalsService.onUpsertSubToDo(toDo.userId, toDo.toDTO())
        );

        await this._toDoRepos.update({ id, userId }, values);
    }

    async deleteToDo(dto: DeleteToDoDTO): Promise<void> {
        await this._toDoRepos.delete(dto);
    }

    @Transactional()
    async fulfilToDo(dto: FulfillToDoDTO) {
        const { id, userId } = dto;
        const today = new Date();

        const toDo = pipe(
            await this._toDoRepos.findOneBy({ id, userId }),
            throwIf(isNull, () => new NotFoundException()),
            toDo => toDo.toDTO(),
            throwIf(
                toDo => !isDayToDo(today, toDo) || toDo.completed,
                () => new ConflictException()
            )
        );

        toDo.period && await this._toDoRepos.save({
            date: add(today, { [toDo.period.unit]: toDo.period.amount }),
            ...omit(["id", "date"], toDo)
        });

        await this._toDoRepos.update(id, { completed: true });
        await this._fulfilledService.handleFulfilled(toDo);
    }

    @Transactional()
    async onGoalDeleted(userId: number): Promise<void> {
        await this._toDoRepos.update(userId, { isSub: false });
    }
}

