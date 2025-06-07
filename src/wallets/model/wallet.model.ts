import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";

@Entity("wallets")
export class Wallet extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    coins: number;
}