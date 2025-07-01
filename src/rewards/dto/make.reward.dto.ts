import { ProbabilityBuffDTO } from "./probability.buff.dto";

export interface MakeRewardDTO {
    exp: number;
    coin: number;
    buff?: ProbabilityBuffDTO;
}
