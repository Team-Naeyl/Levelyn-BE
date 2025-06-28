import { Column, Entity, PrimaryColumn } from "typeorm";
import { ModelBase } from "../../common";

@Entity("goals")
export class Goal extends ModelBase {
    @PrimaryColumn({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "varchar" })
    description: string;

    @Column({ type: "date" })
    since: Date;

    @Column({ type: "date" })
    until: Date;
}