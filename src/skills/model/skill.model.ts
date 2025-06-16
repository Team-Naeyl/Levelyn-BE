import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Exclude } from "class-transformer";
import { SkillRequirement } from "./skill.requirement.model";

@Entity("skills")
export class Skill extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "effect_id", type: "varchar" })
    effectId: string;

    @Exclude()
    @Column({ name: "requirement_id", type: "integer" })
    requirementId: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    description: string;

    @Exclude()
    @OneToOne(() => SkillRequirement)
    @JoinColumn({ name: "requirement_id" })
    requirement: SkillRequirement;
}