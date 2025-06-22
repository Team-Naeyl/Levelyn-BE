import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { ModelBase } from "../common";
import { Wallet } from "../wallets";
import { Exclude } from "class-transformer";
import { UserDTO } from "./dto";
import { UserState } from "../states";

@Entity("users")
export class User extends ModelBase<UserDTO> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "open_id", type: "varchar", unique: true })
    openId: string;

    @Column({ name: "state_id", type: "integer", unique: true })
    stateId: number;

    @Column({ name: "wallet_id", type: "integer", unique: true })
    walletId: number;

    @Column({ type: "varchar" })
    name: string;

    @Exclude()
    @OneToOne(() => UserState)
    @JoinColumn({ name: "status_id" })
    state: UserState;

    @Exclude()
    @OneToOne(() => Wallet)
    @JoinColumn({ name: "wallets_id" })
    wallet: Wallet;

    toDTO(): UserDTO {
        return {
            ...super.toDTO(),
            state: this.state.toDTO(),
            wallet: this.wallet.toDTO()
        };
    }
}