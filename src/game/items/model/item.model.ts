import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { ItemType } from "./item.type.model";
import { Exclude } from "class-transformer";
import { ItemDTO } from "../dto";
import { ItemSubType } from "./item.sub-type.model";
import { ItemEffect } from "./item.effect.model";
import { OwnableBase } from "../../common";

@Entity("items")
export class Item extends OwnableBase<ItemDTO> {
    @Exclude()
    @Column({ name: "type_id", type: "integer" })
    typeId: number;

    @Exclude()
    @Column({ name: "sub_type_id", type: "integer", nullable: true })
    subTypeId: number | null;

    @Exclude()
    @Column({ name: "effect_id", type: "integer" })
    effectId: number;

    @Exclude()
    @Column({ type: "float" })
    weight: number;

    @Exclude()
    @ManyToOne(() => ItemType)
    @JoinColumn({ name: "type_id" })
    type: ItemType;

    @Exclude()
    @ManyToOne(() => ItemSubType)
    @JoinColumn({ name: "sub_type_id" })
    subType: ItemSubType | null;

    @Exclude()
    @OneToOne(() => ItemEffect, { lazy: true, cascade: ["insert"], onDelete: "CASCADE" })
    @JoinColumn({ name: "effect_id" })
    effect: Promise<ItemEffect>;

    toDTO(): ItemDTO {
        return {
            ...super.toDTO(),
            type: this.subType ? this.subType.value : this.type.value
        };
    }
}