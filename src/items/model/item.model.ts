import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { ItemType } from "./item.type.model";
import { Exclude } from "class-transformer";
import { ItemDTO } from "../dto";

@Entity("items")
export class Item extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "type_id", type: "integer" })
    typeId: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    description: string;

    @Exclude()
    @ManyToOne(() => ItemType)
    @JoinColumn({ name: "type_id" })
    type: ItemType;

    toDTO(): ItemDTO {
        return Object.assign(super.toDTO(), {
            type: this.type.value
        });
    }
}