import { ModelBase } from "../../common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ToDoPeriodDTO, ToDoPeriodUnit } from "../dto";
import { Exclude } from "class-transformer";

@Entity("to-do-repeat")
export class ToDoPeriod extends ModelBase<ToDoPeriodDTO> {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "integer" })
    amount: number;

    @Column({ type: "char" })
    unit: ToDoPeriodUnit;
}