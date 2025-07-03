import { ProbabilityBuffDTO } from "../../game/random-boxes/dto";

export interface MakeRewardDTO {
    exp?: number;
    coin?: number;
    buff?: ProbabilityBuffDTO;
}
