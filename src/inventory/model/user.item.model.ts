import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Item } from "../../game";

@Entity("user_items")
export class UserItem extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "boolean", default: false })
    equipped: boolean;

    @Column({ name: "item_id", type: "integer" })
    itemId: number;

    @ManyToOne(() => Item, { eager: true })
    @JoinColumn({ name: "item_id" })
    item: Item;
}