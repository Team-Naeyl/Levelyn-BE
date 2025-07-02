import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ToDo } from "../model";
import { LessThanOrEqual, Repository } from "typeorm";
import { CreateToDoDTO, GetToDoDTO, GetDailyToDoListDTO, UpdateToDoDTO, ToDoDTO } from "../dto";
import { filter, isNull, pipe, map, throwIf, toArray } from "@fxts/core";
import { add } from "date-fns";
import { Transactional } from "typeorm-transactional";
import { isDayToDo } from "./service.internal";
import { GoalsService } from "./goals.service";
import { excludeTimestamp, excludeTimestampOnly } from "../../common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { UserToDoFulfilledEvent } from "../event";

@Injectable()
export class ToDoService {
    private readonly _logger: Logger = new Logger(ToDoService.name);

    constructor(
       @InjectRepository(ToDo)
       private readonly _toDoRepos: Repository<ToDo>,
       @Inject(forwardRef(() => GoalsService))
       private readonly _goalsService: GoalsService,
       @Inject(EventEmitter2)
       private readonly _eventEmitter: EventEmitter2
    ) { }

    @Transactional()
    async createToDo(dto: CreateToDoDTO): Promise<void> {
        const toDo = await this._toDoRepos.save(dto);
        toDo.isSub && await this._goalsService.onUpsertSubToDo(toDo.userId, toDo);
    }

    async getDailyToDoList(dto: GetDailyToDoListDTO): Promise<ToDoDTO[]> {
        const { userId, date } = dto;

        return pipe(
            await this._toDoRepos.findBy({ userId, date: LessThanOrEqual(date) }),
            map(__toDTO),
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
            async toDo => toDo.isSub || await this._goalsService.onUpsertSubToDo(toDo.userId, toDo)
        );

        await this._toDoRepos.update({ id, userId }, values);
    }

    async deleteToDo(dto: GetToDoDTO): Promise<void> {
        await this._toDoRepos.delete(dto);
    }

    @Transactional()
    async fulfilToDo(dto: GetToDoDTO): Promise<void> {
        const { id, userId } = dto;
        const today = new Date();

        const toDo = pipe(
            await this._toDoRepos.findOneBy({ id, userId }),
            throwIf(isNull, () => new NotFoundException()),
            throwIf(
                toDo => !isDayToDo(today, toDo) || toDo.completed,
                () => new ConflictException()
            )
        );

        toDo.period && await this._toDoRepos.save({
            date: add(today, { [toDo.period.unit]: toDo.period.amount }),
            ...excludeTimestamp(toDo, "id", "date")
        });

        await this._toDoRepos.update(id, { completed: true });
        this._eventEmitter.emit("to-do.fulfilled", new UserToDoFulfilledEvent(userId));
    }

    @Transactional()
    async onGoalDeleted(userId: number): Promise<void> {
        await this._toDoRepos.update(userId, { isSub: false });
    }
}

function __toDTO(toDo: ToDo): ToDoDTO {
    const { period, ...rest } = excludeTimestamp(toDo, "userId", "periodId");

    return {
        ...rest,
        period: period && excludeTimestampOnly(period)
    };
}

