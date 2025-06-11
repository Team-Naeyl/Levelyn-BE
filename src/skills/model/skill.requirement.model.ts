import { ModelBase } from "../../common";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("skill_requirements")
export class SkillRequirement extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "min_level", type: "integer" })
    minLevel: number;

    @Column({ name: "min_attack", type: "float" })
    minAttack: number;

    @Column({ name: "min_will", type: "float" })
    minWill: number;
}