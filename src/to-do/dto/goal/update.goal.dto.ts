import { CreateGoalDTO } from "./create.goal.dto";
export type UpdateGoalDTO = { userId: number; } & Partial<Omit<CreateGoalDTO, "userId">>;