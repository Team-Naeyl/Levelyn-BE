import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { ModelBase } from "../common";
import { Wallet } from "../wallets/model";
import { State } from "../states/state.model";
import { Tile } from "../tiles/tile.model";


@Entity("users")
export class User extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "email", type: "varchar", unique: true })
    email: string;

    @Column({ name: "state_id", type: "integer", unique: true })
    stateId: number;

    @Column({ name: "tile_id", type: "integer", unique: true })
    tileId: number;

    @Column({ name: "wallet_id", type: "integer", unique: true })
    walletId: number;

    @Column({ type: "varchar" })
    name: string;

    @OneToOne(() => State, { cascade: ["insert"], onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "state_id" })
    state: State;

    @OneToOne(() => Tile, { cascade: ["insert"], onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "tile_id" })
    tile: Tile;

    @OneToOne(() => Wallet, { cascade: ["insert"], onDelete: "CASCADE", eager: true })
    @JoinColumn({ name: "wallet_id" })
    wallet: Wallet;
}