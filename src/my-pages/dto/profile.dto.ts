import { UserDTO } from "../../users/dto";

export type ProfileDTO = Pick<UserDTO, "name" | "email">;