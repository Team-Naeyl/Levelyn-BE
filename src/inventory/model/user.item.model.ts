import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Exclude } from "class-transformer";
import { Item } from "../../items";
import { UserItemDTO } from "../dto";
import { UserOwning } from "./user.owning.model";
import { ItemDTO } from "../../items/dto";

@Entity("user_items")
export class UserItem extends UserOwning<Item> {

    @Exclude()
    @Column({ name: "item_id", type: "integer" })
    itemId: number;

    @Exclude()
    @ManyToOne(() => Item)
    @JoinColumn({ name: "item_id" })
    item: Item;

    toDTO(): UserItemDTO {
        return super.toDTO();
    }

    protected owned(): Item {
        return this.item;
    }
}