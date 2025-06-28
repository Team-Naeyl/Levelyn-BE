import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Item } from "../../game";

@Entity("player_items")
export class PlayerItem extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "player_id", type: "integer" })
    playerId: number;

    @Column({ type: "boolean", default: false })
    equipped: boolean;

    @Column({ name: "item_id", type: "integer" })
    itemId: number;

    @ManyToOne(() => Item)
    @JoinColumn({ name: "item_id" })
    item: Item;
}