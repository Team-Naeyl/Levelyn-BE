import { UserStatDTO } from "./user.stat.dto";

export interface LevelUpDTO {
    userId: number;
    stat: UserStatDTO;
}