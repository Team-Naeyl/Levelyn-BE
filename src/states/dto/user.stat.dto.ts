import { UserStateDTO } from "./user.state.dto";

export type UserStatDTO = Pick<UserStateDTO, "level" | "attack" | "will">;