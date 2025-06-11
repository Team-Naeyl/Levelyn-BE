import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { ModelBase } from "../common";
import { Wallet } from "../wallets";
import { Exclude } from "class-transformer";
import { Dashboard } from "../dashboards";
import { UserDTO } from "./dto";

@Entity("users")
export class User extends ModelBase{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "open_id", type: "varchar", unique: true })
    openId: string;

    @Column({ type: "varchar" })
    name: string;

    @Exclude()
    @OneToOne(() => Dashboard)
    @JoinColumn({ name: "dashboard_id" })
    dashboard: Dashboard;

    @Exclude()
    @OneToOne(() => Wallet)
    @JoinColumn({ name: "wallets_id" })
    wallet: Wallet;

    toDTO(): UserDTO {
        return {
            ...super.toDTO(),
            dashboard: this.dashboard.toDTO(),
            wallet: this.wallet.toDTO()
        };
    }
}