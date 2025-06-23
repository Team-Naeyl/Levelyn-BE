import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { WalletDTO } from "../dto";

@Entity("wallets")
export class Wallet extends ModelBase<WalletDTO> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', default: 0 })
    coin: number;
}