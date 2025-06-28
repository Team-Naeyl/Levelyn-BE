import { ModelBase } from "../../common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type ToDoPeriodUnit = "years" | "months" | "weeks" | "days";

@Entity("to_do_periods")
export class ToDoPeriod extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "integer" })
    amount: number;

    @Column({ type: "char" })
    unit: ToDoPeriodUnit;
}