import { UserDTO } from "./user.dto";
export type GetUserDTO = Partial<Omit<UserDTO, "dashboard" | "wallet">>;