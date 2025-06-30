import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { ModelBase } from "../../common";
import { Player } from "../../players/model";
import { Wallet } from "../../wallets/model";


@Entity("users")
export class User extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "open_id", type: "varchar", unique: true })
    openId: string;

    @Column({ name: "player_id", type: "integer", unique: true })
    playerId: number;

    @Column({ name: "wallet_id", type: "integer", unique: true })
    walletId: number;

    @Column({ type: "varchar" })
    name: string;

    @OneToOne(() => Player, { cascade: ["insert"], onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "player_id" })
    player: Player;

    @OneToOne(() => Wallet, { cascade: ["insert"], onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "wallet_id" })
    wallet: Wallet;
}