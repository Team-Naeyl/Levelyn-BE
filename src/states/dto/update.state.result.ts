import { StateDTO } from "./state.dto";

export interface UpdateStateResult extends StateDTO {
    levelUp: boolean;
}