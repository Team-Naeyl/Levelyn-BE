import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../../common";
import { SkillRequirement } from "./skill.requirement.model";
import { SkillEffect } from "./skill.effect.model";

@Entity("skills")
export class Skill extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "effect_id", type: "integer" })
    effectId: number;

    @Column({ name: "requirement_id", type: "integer" })
    requirementId: number;

    @Column({ type: "varchar" })
    name: string;

    @Column({ type: "varchar" })
    description: string;

    @OneToOne(() => SkillRequirement)
    @JoinColumn({ name: "requirement_id" })
    requirement: SkillRequirement;

    @OneToOne(() => SkillEffect, { lazy: true })
    @JoinColumn({ name: "effect_id" })
    effect: Promise<SkillEffect>;
}