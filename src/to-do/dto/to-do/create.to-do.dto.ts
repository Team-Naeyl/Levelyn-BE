import { ToDoPeriodDTO } from "./to-do.period.dto";

export interface CreateToDoDTO {
    userId: number;
    description: string;
    date: Date;
    isSub?: boolean;
    period?: ToDoPeriodDTO;
}