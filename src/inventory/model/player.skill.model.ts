import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Skill } from "../../game";
import { Exclude } from "class-transformer";
import { PlayerSkillDTO } from "../dto";
import { PlayerOwning } from "./player.owning.model";

@Entity("player_skills")
export class PlayerSkill extends PlayerOwning<Skill> {

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

    toDTO(): PlayerSkillDTO {
        return super.toDTO();
    }

    protected owned(): Skill {
        return this.skill;
    }
}