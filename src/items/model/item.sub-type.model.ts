import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";

@Entity("item__sub_types")
export class ItemSubType extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    value: string;
}