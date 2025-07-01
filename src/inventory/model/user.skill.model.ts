import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skill } from "../../game";
import { ModelBase } from "../../common";

@Entity("user_skills")
export class UserSkill extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ type: "boolean", default: false })
    equipped: boolean;

    @Column({ name: "skill_id", type: "integer" })
    skillId: number;

    @ManyToOne(() => Skill, { eager: true })
    @JoinColumn({ name: "skill_id" })
    skill: Skill;
}