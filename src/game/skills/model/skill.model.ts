import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";
import { SkillRequirement } from "./skill.requirement.model";
import { OwnableBase } from "../../common";
import { SkillDTO } from "../dto";
import { SkillEffect } from "./skill.effect.model";

@Entity("skills")
export class Skill extends OwnableBase<SkillDTO> {
    @Exclude()
    @Column({ name: "effect_id", type: "integer" })
    effectId: number;

    @Exclude()
    @Column({ name: "requirement_id", type: "integer" })
    requirementId: number;

    @Exclude()
    @OneToOne(() => SkillRequirement, { onDelete: "CASCADE", cascade: ["insert"] })
    @JoinColumn({ name: "requirement_id" })
    requirement: SkillRequirement;

    @Exclude()
    @OneToOne(() => SkillEffect, { lazy: true, onDelete: "CASCADE", cascade: ["insert"] })
    @JoinColumn({ name: "effect_id" })
    effect: Promise<SkillEffect>;
}