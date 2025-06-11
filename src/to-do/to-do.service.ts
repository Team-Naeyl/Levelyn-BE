import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ToDo } from "./to-do.model";
import { LessThanOrEqual, MoreThan, Repository } from "typeorm";
import { CreateToDoDTO, ToDoDTO, UpdateToDoDTO } from "./dto";
import { compareToDo } from "./compare-to-do";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class ToDoService {
    private readonly _logger: Logger = new Logger(ToDoService.name);

    constructor(
       @InjectRepository(ToDo)
       private readonly _toDoRepos: Repository<ToDo>,
       @Inject(EventEmitter2)
       private readonly _eventEmitter: EventEmitter2
    ) {}

    async createToDo(dto: CreateToDoDTO): Promise<void> {
        await this._toDoRepos.save(dto);
    }

    async getDailyToDoList(userId: number): Promise<ToDoDTO[]> {
        const now = new Date();

        const toDoList = await this._toDoRepos.find({
            where: {
                userId,
                since: LessThanOrEqual(now),
                until: MoreThan(now)
            },
            order: { since: "ASC", until: "ASC" }
        })

       return ToDo.toDTOArray(toDoList).sort(compareToDo);
    }


    async updateToDo(dto: UpdateToDoDTO): Promise<void> {
        const { id, ...values } = dto;
        await this._toDoRepos.update(id, values);
    }


    async deleteToDo(...ids: number[]): Promise<void> {
        await this._toDoRepos.delete(ids);
    }

    async fulfil(id: number) {
        const toDo = await this._toDoRepos.findOneBy({ id });
        if (!toDo) throw new NotFoundException();


    }

}