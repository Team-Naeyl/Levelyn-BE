export type UpdateToDoDTO = { id: number } & Partial<{
    description: string;
    since: Date;
    until: Date;
    targetCount: number;
}>