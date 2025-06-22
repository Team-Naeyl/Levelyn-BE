import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wallet } from "../model";
import { Repository } from "typeorm";
import { UpdateWalletDTO } from "../dto";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class WalletsService {

    constructor(
        @InjectRepository(Wallet)
        private _walletsRepos: Repository<Wallet>
    ) {}

    @Transactional()
    async updateCoin(dto: UpdateWalletDTO): Promise<void> {
        const { id, deltaCoin } = dto;
        await this._walletsRepos.increment({ id }, "coin", deltaCoin);
    }
}