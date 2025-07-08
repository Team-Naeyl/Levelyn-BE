import { Injectable, Logger } from "@nestjs/common";
import { filter, map, Observable, startWith, Subject } from "rxjs";
import { UserNotification } from "./notification";
import { UserEvent } from "../common";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class NotificationsService {
    private readonly _logger: Logger = new Logger(NotificationsService.name);
    private readonly _events = new Subject<UserEvent>();

    getUserStream(userId: number): Observable<UserNotification> {
        return this._events.asObservable()
            .pipe(
                startWith(new UserEvent(userId, "start", null)),
                filter(msg => msg.userId === userId),
                map(({ sub, data }): UserNotification => ({ sub, data })),
            );
    }

    @OnEvent("user.event")
    onNotification(msg: UserEvent): void {
        this._logger.debug(JSON.stringify(msg));
        this._events.next(msg);
    }
}