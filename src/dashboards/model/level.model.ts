import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";

@Entity("levels")
export class Level extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "max_exp" })
    maxExp: number;

    @Column({ name: "delta_attack" })
    deltaAttack: number;

    @Column({ name: "delta_will" })
    deltaWill: number;
}