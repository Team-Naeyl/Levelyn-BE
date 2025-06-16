import { ToDoPeriodDTO } from "./to-do.period.dto";

export interface ToDoDTO {
    id: number;
    description: string;
    date: Date;
    period: ToDoPeriodDTO | null;
    completed: boolean;
    isSub: boolean;
}