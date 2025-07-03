import { UpsertUserDTO } from "./upsert.user.dto";

export type UpdateUserDTO = { id: number; } & Partial<UpsertUserDTO>;