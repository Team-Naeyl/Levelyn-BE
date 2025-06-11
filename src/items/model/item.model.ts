import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { ItemType } from "./item.type.model";
import { Exclude } from "class-transformer";
import { ItemDTO } from "../dto";
import { ItemSubType } from "./item.sub-type.model";

@Entity("items")
export class Item extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "type_id", type: "integer" })
    typeId: number;

    @Exclude()
    @Column({ name: "sub_type_id", type: "integer", nullable: true })
    subTypeId: number | null;

    @Exclude()
    @Column({ name: "effect_id", type: "varchar" })
    effectId: string;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    description: string;

    @Exclude()
    @ManyToOne(() => ItemType)
    @JoinColumn({ name: "type_id" })
    type: ItemType;

    @Exclude()
    @ManyToOne(() => ItemSubType)
    @JoinColumn({ name: "sub_type_id" })
    subType: ItemSubType | null;

    toDTO(): ItemDTO {
        return {
            ...super.toDTO(),
            type: this.subType ? this.subType.value : this.type.value
        };
    }
}