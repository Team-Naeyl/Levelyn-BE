import { ModelBase } from "../../common";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class TypeBase extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    value: string;
}