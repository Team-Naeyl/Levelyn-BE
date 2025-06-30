import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skill } from "../../game";
import { ModelBase } from "../../common";

@Entity("player_skills")
export class PlayerSkill extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "player_id", type: "integer" })
    playerId: number;

    @Column({ type: "boolean", default: false })
    equipped: boolean;

    @Column({ name: "skill_id", type: "integer" })
    skillId: number;

    @ManyToOne(() => Skill, { eager: true })
    @JoinColumn({ name: "skill_id" })
    skill: Skill;
}