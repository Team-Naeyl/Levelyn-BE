import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";

@Entity("levels")
export class Level extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "max_exp", type: "float" })
    maxExp: number;

    @Column({ name: "delta_attack", type: "float" })
    deltaAttack: number;

    @Column({ name: "delta_will", type: "float" })
    deltaWill: number;
}