import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";
import { Item } from "../../game";
import { PlayerItemDTO } from "../dto";
import { PlayerOwning } from "./player.owning.model";

@Entity("player_items")
export class PlayerItem extends PlayerOwning<Item> {

    @Exclude()
    @Column({ name: "item_id", type: "integer" })
    itemId: number;

    @Exclude()
    @ManyToOne(() => Item)
    @JoinColumn({ name: "item_id" })
    item: Item;

    toDTO(): PlayerItemDTO {
        return super.toDTO();
    }

    protected owned(): Item {
        return this.item;
    }
}