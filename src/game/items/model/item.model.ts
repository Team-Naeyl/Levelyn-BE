import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ItemType } from "./item.type.model";
import { ItemSubType } from "./item.sub-type.model";
import { ItemEffect } from "./item.effect.model";
import { ModelBase } from "../../../common";

@Entity("items")
export class Item extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "type_id", type: "integer" })
    typeId: number;

    @Column({ name: "sub_type_id", type: "integer", nullable: true })
    subTypeId: number | null;

    @Column({ name: "effect_id", type: "integer" })
    effectId: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    description: string;

    @Column({ type: "float" })
    weight: number;

    @ManyToOne(() => ItemType)
    @JoinColumn({ name: "type_id" })
    type: ItemType;

    @ManyToOne(() => ItemSubType)
    @JoinColumn({ name: "sub_type_id" })
    subType: ItemSubType | null;

    @OneToOne(() => ItemEffect, { lazy: true, cascade: ["insert"], onDelete: "CASCADE" })
    @JoinColumn({ name: "effect_id" })
    effect: Promise<ItemEffect>;
}