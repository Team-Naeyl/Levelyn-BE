import { CreateToDoDTO } from "./create.to-do.dto";

export type UpdateToDoDTO
    = { id: number; userId: number }
    & Partial<Omit<CreateToDoDTO, "userId">>;