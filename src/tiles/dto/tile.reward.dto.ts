import { TileRewardEvent } from "./tile.reward.event";

export type TileRewardDTO = Omit<TileRewardEvent, "userId">;