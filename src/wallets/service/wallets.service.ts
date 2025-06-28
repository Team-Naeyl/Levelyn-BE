import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "../model";
import { Repository } from "typeorm";
import { UpdateWalletDTO, WalletDTO } from "../dto";
import { Transactional } from "typeorm-transactional"
import { isNull, pipe, throwIf } from "@fxts/core";
import { excludeTimestamp } from "../../common";

@Injectable()
export class WalletsService {

    constructor(
        @InjectRepository(Wallet)
        private _walletsRepos: Repository<Wallet>
    ) {  }

    async getWallet(id: number): Promise<WalletDTO> {
        return pipe(
            await this._walletsRepos.findOneBy({ id }),
            throwIf(isNull, () => new ForbiddenException()),
            w => excludeTimestamp(w, "id")
        );
    }

    @Transactional()
    async updateCoin(dto: UpdateWalletDTO): Promise<void> {
        const { id, deltaCoin } = dto;
        await this._walletsRepos.increment({ id }, "coin", deltaCoin);
    }
}