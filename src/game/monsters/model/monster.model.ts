import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../../common";
import { MonsterType } from "./moster.type.model";

@Entity("monsters")
export class Monster extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "region_id", type: "integer" })
    regionId: number;

    @Column({ name: "type_id", type: "integer" })
    typeId: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "float" })
    hp: number;

    @ManyToOne(() => MonsterType)
    @JoinColumn({ name: "type_id" })
    type: MonsterType;

}