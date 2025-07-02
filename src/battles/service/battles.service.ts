import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class BattlesService {
    private readonly _logger: Logger = new Logger(BattlesService.name);

    async createBattle(userId: number) {

    }
}