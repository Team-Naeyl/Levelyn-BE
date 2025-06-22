import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { UserStateDTO } from "../dto";
import { Exclude } from "class-transformer";

@Entity("user_stats")
export class UserState extends ModelBase<UserStateDTO> {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "region_id", type: "integer", default: 1 })
    regionId: number;

    @Column({ name: "position", type: "integer", default: 0 })
    position: number;

    @Column({ type: "integer", default: 1 })
    level: number;

    @Column({ type: "float", default: 0.0 })
    exp: number;

    @Column({ type: "float", default: 10.0 })
    attack: number;

    @Column({ type: "float", default: 15.0 })
    will: number;
}