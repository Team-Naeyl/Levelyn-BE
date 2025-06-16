import { ToDoDTO } from "./to-do.dto";

export interface DailyToDoListDTO {
    date: Date;
    toDoList: ToDoDTO[];
}