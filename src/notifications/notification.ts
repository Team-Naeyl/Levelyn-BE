import { UserEvent } from "../common";
export type UserNotification = Omit<UserEvent, "userId">;