import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../../common";

@Entity("item_effects")
export class ItemEffect extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "float", default: 0 })
    attack: number;

    @Column({ type: "float", default: 0 })
    will: number;

    @Column({ type: "float", default: 0 })
    exp: number;

    @Column({ type: "integer", default: 0 })
    coin: number;

    @Column({ name: "p_item", type: "float", default: 0 })
    pItem: number;

    @Column({ name: "p_coin", type: "float", default: 0 })
    pCoin: number;

    @Column({ name: "penalty_duration", type: "integer", default: 0 })
    penaltyDuration: number;
}