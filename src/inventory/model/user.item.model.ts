import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Exclude } from "class-transformer";
import { Item } from "../../items";
import { UserItemDTO } from "../../items/dto";

@Entity("user_items")
export class UserItem extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Exclude()
    @Column({ name: "item_id", type: "integer" })
    itemId: number;

    @Column({ type: "boolean", default: false })
    equipped: boolean;

    @Exclude()
    @ManyToOne(() => Item)
    @JoinColumn({ name: "item_id" })
    item: Item;

    toDTO(): UserItemDTO {
        return Object.assign(super.toDTO(), {
            item: this.item.toDTO()
        })
    }
}