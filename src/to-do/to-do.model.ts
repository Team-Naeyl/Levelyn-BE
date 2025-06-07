import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../common";
import { format } from 'date-fns';
import { Exclude } from 'class-transformer';

@Entity("to-do-list")
export class ToDo extends ModelBase {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "user_id" })
    userId: number;

    @Column({ name: "goal_id" })
    goalId: number;

    @Column()
    description: string;

    @Column()
    since: Date;

    @Column()
    until: Date;

    @Column({ name: "target_count", default: 1 })
    targetCount: number;

    @Column({ name: "current_count", default: 0 })
    currentCount: number;

    get range(): [string, string] {
        return [this.since, this.until].map(date => format(
          date, "yyyy/MM/dd hh:mm"
        )) as [string, string];
    }

    get completed(): boolean {
        return this.currentCount >= this.targetCount;
    }

    toDTO(): any {
        return {
            ...super.toDTO(),
            range: this.range,
            completed: this.completed,
        };
    }
}