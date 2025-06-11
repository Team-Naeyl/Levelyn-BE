import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ModelBase } from "../../common";
import { Exclude } from "class-transformer";
import { ToDo } from "../../to-do";
import { GoalDTO } from "../dto/goal.dto";

@Entity("goals")
export class Goal extends ModelBase<GoalDTO> {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @Column({ name: "user_id", type: "integer", unique: true })
    userId: number;

    @Column({ type: "varchar" })
    description: string;

    @Column({ type: "date" })
    due: Date;

    @Column({ type: "boolean", default: false })
    success: boolean;

    @Exclude()
    @OneToMany(() => ToDo, toDo => toDo.goal)
    toDoList: ToDo[];

    get progress(): [number, number] {

        return [
            this.toDoList
                .filter(toDo => toDo.completed).length,
            this.toDoList.length
        ];
    }

    toDTO(): GoalDTO {
        return {
            ...super.toDTO()
        };
    }
}