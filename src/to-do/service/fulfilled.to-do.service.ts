import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import random from "random";
import { ToDoDTO } from "../dto";




@Injectable()
export class FulfilledToDoService {
    private readonly _logger: Logger = new Logger(FulfilledToDoService.name);

    constructor(
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2
    ) {}

    async handleFulfilled(dto: ToDoDTO) {

    }

    private async triggerItemEvent() {

    }
}