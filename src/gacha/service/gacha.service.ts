import { Inject, Injectable, Logger } from "@nestjs/common";
import { GachaResultConfigService } from "./gacha.result.config.service";
import { RandomItemService } from "./random.item.service";
import { RandomCoinService } from "./random.coin.service";
import { GachaResult } from "../dto";

@Injectable()
export class GachaService {
    private readonly _logger: Logger = new Logger(GachaService.name);

    constructor(
        @Inject(GachaResultConfigService)
        private readonly _resultConfigService: GachaResultConfigService,
        @Inject(RandomItemService)
        private readonly _randomItemService: RandomItemService,
        @Inject(RandomCoinService)
        private readonly _randomCoinService: RandomCoinService
    ) {}

    async runGacha(): Promise<GachaResult> {
        const config = this._resultConfigService.getConfig();
        const itemId = config.item ? await this._randomItemService.pickItem() : null;
        const coin = config.item ? this._randomCoinService.getCoin() : null;
        return { itemId, coin };
    }
}