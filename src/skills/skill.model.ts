import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../common";
import { Exclude } from "class-transformer";

@Entity("skills")
export class Skill extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "effect_id", type: "integer" })
    effectId: number;

    @Exclude()
    @Column({ name: "requirement_id", type: "integer" })
    requirementId: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    description: string;
}