import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Skill } from "../../skills";
import { Exclude } from "class-transformer";
import { UserSkillDTO } from "../dto";

@Entity("user_skills")
export class UserSkill extends ModelBase<UserSkillDTO> {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Exclude()
    @Column({ name: "skill_id", type: "integer" })
    skillId: number;

    @Column({ type: "boolean", default: false })
    equipped: boolean;

    @Exclude()
    @ManyToOne(() => Skill)
    @JoinColumn({ name: "skill_id" })
    skill: Skill;

    toDTO(): UserSkillDTO {
        return {
            ...super.toDTO(),
            skill: this.skill.toDTO()
        };
    }
}