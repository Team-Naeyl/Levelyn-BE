export interface ToDoDTO {
    id: number;
    goalId: number | null;
    description: string;
    since: Date;
    until: Date;
    period: [Date, Date];
    progress: [number, number] | null;
    completed: boolean;
}