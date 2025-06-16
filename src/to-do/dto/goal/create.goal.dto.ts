export interface CreateGoalDTO {
    userId: number;
    description: string;
    range: [Date, Date]
}