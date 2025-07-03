import { StateDTO } from "../../states/dto";

interface IPlayer extends StateDTO {
    userId: number;

}

export class Player implements IPlayer {
    userId: number;
    level: number;
    exp: number;
    attack: number;
    will: number;
    position: number;
}