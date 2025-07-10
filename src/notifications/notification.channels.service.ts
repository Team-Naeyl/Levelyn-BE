import { Inject, Injectable, Logger } from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { UserNotification } from "./notification";
import { EventBus } from "@nestjs/cqrs";

@Injectable()
export class NotificationChannelsService {
    private readonly _logger: Logger = new Logger(NotificationChannelsService.name);

    private readonly _channels: {
        [userId: number]: Subject<UserNotification>
    } = {};

    constructor(
       @Inject(EventBus)
       private readonly _eventBus: EventBus,
    ) {}

    addNotification(
        userId: number,
        notification: UserNotification
    ):void {

        this._logger.debug(
            `Notification for ${userId} added: ${notification}`
        );

        this.getSubject(userId).next(notification);
    }

    getChannel(userId: number): Observable<UserNotification> {
        this._logger.debug(`Channel for ${userId} subscribed`);
        return this._channels[userId].asObservable();
    }

    private getSubject(userId: number): Subject<UserNotification> {

        if (!this._channels[userId])
            this._channels[userId] = new Subject<UserNotification>();

        return this._channels[userId];
    }
}