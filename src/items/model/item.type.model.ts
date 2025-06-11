import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("item_types")
export class ItemType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    value: string;
}