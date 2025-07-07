import { ModelBase } from "../common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tiles")
export class Tile extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "integer", default: 0 })
    position: number;

    @Column({ type: "integer", default: 0 })
    penaltyCount: number;
}