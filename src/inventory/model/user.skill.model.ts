import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Skill } from "../../game/skills";
import { Exclude } from "class-transformer";
import { UserSkillDTO } from "../dto";
import { UserOwning } from "./user.owning.model";

@Entity("user_skills")
export class UserSkill extends UserOwning<Skill> {

    @Exclude()
    @Column({ name: "effectId", type: "varchar", nullable: true })
    effectId: string;

    @Exclude()
    @Column({ name: "skill_id", type: "integer" })
    skillId: number;

    @Exclude()
    @ManyToOne(() => Skill)
    @JoinColumn({ name: "skill_id" })
    skill: Skill;

    toDTO(): UserSkillDTO {
        return super.toDTO();
    }

    protected owned(): Skill {
        return this.skill;
    }
}