import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../common";
import { Exclude } from 'class-transformer';
import { ToDoDTO } from "./dto";
import { Goal } from "../goals/model";

@Entity("to-do-list")
export class ToDo extends ModelBase<ToDoDTO> {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "user_id", type: "integer" })
    userId: number;

    @Column({ name: "goal_id", type: "integer", nullable: true })
    goalId: number | null;

    @Column({ type: "varchar" })
    description: string;

    @Column({ type: "datetime" })
    since: Date;

    @Column({ type: "datetime" })
    until: Date;

    @Exclude()
    @Column({ name: "target_count", type: "integer",  default: 1 })
    targetCount: number;

    @Exclude()
    @Column({ name: "current_count", type: "integer",  default: 0 })
    currentCount: number;

    @ManyToOne(() => Goal)
    @JoinColumn({ name: "goal_id" })
    goal: Goal

    get period(): [Date, Date] {
        return [this.since, this.until];
    }

    get progress(): [number, number] | null {
        return this.targetCount === 1
            ? null : [this.currentCount, this.targetCount];
    }

    get completed(): boolean {
        return this.currentCount >= this.targetCount;
    }

    toDTO(): ToDoDTO {
        return {
            ...super.toDTO(),
            period: this.period,
            progress: this.progress,
            completed: this.completed,
        };
    }
}