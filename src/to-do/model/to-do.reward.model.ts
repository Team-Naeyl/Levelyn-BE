import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Exclude } from "class-transformer";
import { ToDoRewardDTO } from "../dto";

@Entity()
export class ToDoReward extends ModelBase<ToDoRewardDTO> {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "is_battle", type: "boolean" })
    isBattle: boolean;

    @Column({ type: "float" })
    exp: number;

    @Column({ name: "item_id", type: "integer", nullable: true })
    itemId: number | null;

    @Column({ type: "integer", nullable: true })
    coin: number | null;
}