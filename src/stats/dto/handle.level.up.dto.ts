import { UserStatDTO } from "./user.stat.dto";

export type HandleLevelUpDTO
    =  { userId: number; } & Omit<UserStatDTO, "id" | "exp">;