import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Level } from "./level.model";
import { Exclude } from "class-transformer";
import { DashboardDTO } from "../dto";
import { ToDo } from "../../to-do";

@Entity("dashboards")
export class Dashboard extends ModelBase<DashboardDTO> {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "level_id", type: "integer", default: 1 })
    levelId: number;

    @Exclude()
    @Column({ name: "current_to_do_id", type: "integer", nullable: true })
    currentToDoId: number | null;

    @Column({ type: "float" })
    exp: number;

    @Column({ type: "float" })
    attack: number;

    @Column({ type: "float" })
    will: number;

    @Column({ name: "n_fulfilled", type: "integer", default: 0 })
    nFulfilled: number;

    @Exclude()
    @ManyToOne(() => Level)
    @JoinColumn({ name: "level_id" })
    level: Level;

    @Exclude()
    @OneToOne(() => ToDo)
    @JoinColumn({ name: "current_to_do_id" })
    currentToDo: ToDo | null;

    toDTO(): DashboardDTO {
        return {
            ...super.toDTO(),
            level: this.level.id,
            maxExp: this.level.maxExp
        };
    }

}