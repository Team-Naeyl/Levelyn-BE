import { Inject, Injectable, Logger } from "@nestjs/common";
import { RandomItemService } from "./random.item.service";
import { RandomCoinService } from "./random.coin.service";
import { Random } from "random";
import { curry, memoize } from "@fxts/core";
import { ProbabilityBuffDTO, RandomBoxDTO } from "../dto";
import { RewardConfig } from "../../config";

@Injectable()
export class RandomBoxesService {
    private readonly _logger: Logger = new Logger(RandomBoxesService.name);
    private readonly binomial: (p?: number) => () => number;
    private readonly _pItem: number;
    private readonly _pCoin: number;

    constructor(
        @Inject(RandomItemService)
        private readonly _randomItemService: RandomItemService,
        @Inject(RandomCoinService)
        private readonly _randomCoinService: RandomCoinService,
        @Inject(Random)
        random: Random,
        @Inject(RewardConfig)
        { pItem, pCoin }: RewardConfig
    ) {
        this.binomial = memoize(curry(random.binomial.bind(random))(1));
        this._pItem = pItem;
        this._pCoin = pCoin;
    }

    async getRandomBox(buff?: ProbabilityBuffDTO): Promise<RandomBoxDTO> {
        const pItem = this._pItem * (buff?.pItem ?? 1);
        const pCoin = this._pCoin * (buff?.pCoin ?? 1);

        const itemId = this.randomBoolean(pItem)
            ? await this._randomItemService.pickItem()
            : null;

        const coin = this.randomBoolean(pCoin)
            ? this._randomCoinService.getCoin()
            : 0;

        return { itemId, coin };
    }

    private randomBoolean(p: number): boolean {
        const dist = this.binomial(p);
        return Boolean(dist());
    }
}