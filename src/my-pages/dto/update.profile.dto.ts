import { UpdateUserDTO } from "../../users/dto";
export type UpdateProfileDTO = { userId: number } & Omit<UpdateUserDTO, "id">;