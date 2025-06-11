export interface CreateToDoDTO {
    userId: number;
    description: string;
    since: Date;
    until: Date;
    targetCount?: number;
}