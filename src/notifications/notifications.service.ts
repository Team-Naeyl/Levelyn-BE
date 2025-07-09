import { Injectable, Logger } from "@nestjs/common";
import { UserNotification } from "./notification";
import { Observable, Subject } from "rxjs";

@Injectable()
export class NotificationsService {
    private readonly _logger: Logger = new Logger(NotificationsService.name);
    private readonly _streams: Map<number, Subject<UserNotification>>;

    async addUserNotification(
        userId: number,
        notification: UserNotification
    ): Promise<void> {
        this.getStream(userId).next(notification);
    }

    getUserNotifications(userId: number): Observable<UserNotification> {
       return this.getStream(userId).asObservable();
    }

    private getStream(userId: number): Subject<UserNotification> {

        if (!this._streams.has(userId)) {
            const stream = new Subject<UserNotification>();
            stream.next(new UserNotification("HANDSHAKE", null));
            this._streams.set(userId, stream);
        }

        return this._streams.get(userId)!;
    }
}

