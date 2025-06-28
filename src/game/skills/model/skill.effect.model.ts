import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../../common";


@Entity("skill_effects")
export class SkillEffect extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "boolean", default: false })
    global: boolean;

    @Column({ type: "float", default: 0 })
    attack: number;

    @Column({ type: "float", default: 0 })
    will: number;
}