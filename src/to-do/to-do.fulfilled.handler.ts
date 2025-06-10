import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import random from "random";




@Injectable()
export class ToDoFulfilledHandler {
    private readonly _logger: Logger = new Logger(ToDoFulfilledHandler.name);

    constructor(
        @Inject(EventEmitter2)
        private readonly _eventEmitter: EventEmitter2
    ) {}

    private async triggerItemEvent() {

    }
}