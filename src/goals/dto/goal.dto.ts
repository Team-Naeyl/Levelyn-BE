import { ToDoDTO } from "../../to-do/dto";

export interface GoalDTO {
    id: number;
    description: string;
    period: [Date, Date];
    progress: [number, number];
    success: boolean;
    toDoList: ToDoDTO[];
}