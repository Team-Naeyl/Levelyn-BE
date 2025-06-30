import { Inject, Injectable, Logger } from "@nestjs/common";
import { PlayersService } from "./service";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class PlayersListener {
    private readonly _logger: Logger = new Logger(PlayersService.name);

    constructor(
        @Inject(PlayersService)
        private readonly _playersService: PlayersService
    ) {}

}