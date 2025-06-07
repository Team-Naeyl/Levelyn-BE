import { ModelBase } from "./model.base";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class OwnableBase extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
}