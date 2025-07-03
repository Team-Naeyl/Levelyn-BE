import { Controller, Inject, Logger, Sse, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from "../auth";
import { AuthQuerySchema, User } from "../common";
import { EventBus, ofType } from "@nestjs/cqrs";
import { filter, map, Observable, tap } from "rxjs";
import { UserRewardedEvent } from "../rewards/event";
import { LevelUpEvent } from "../states/event";
import { WalletUpdatedEvent } from "../wallets/event";
import { UserItemsAddedEvent, UserSkillsAddedEvent } from "../inventory/event";
import { ApiOkResponse, ApiOperation, ApiQuery } from "@nestjs/swagger";
import {
    LevelUpNotification,
    UserItemsAddedNotification,
    UserRewardedNotification, UserSkillsAddedNotification,
    WalletUpdatedNotification
} from "./api";

@Controller('/api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    private readonly _logger: Logger = new Logger(NotificationsController.name);

    constructor(
       @Inject(EventBus)
       private readonly _eventBus: EventBus,
    ) {}

    @Sse("/rewarded")
    @ApiOperation({ summary: "보상 알림" })
    @ApiQuery({ type: AuthQuerySchema, required: true })
    @ApiOkResponse({ type: UserRewardedNotification })
    notifyRewarded(@User("id") userId: number): Observable<UserRewardedNotification> {
        return this.notify(UserRewardedEvent, userId);
    }

    @Sse("/level-up")
    @ApiOperation({ summary: "레벨업 알림" })
    @ApiQuery({ type: AuthQuerySchema, required: true })
    @ApiOkResponse({ type: LevelUpNotification })
    notifyLevelUp(@User("id") userId: number): Observable<LevelUpNotification> {
        return this.notify(LevelUpEvent, userId);
    }

    @Sse("/wallet-updated")
    @ApiOperation({ summary: "잔고 변화 알림" })
    @ApiQuery({ type: AuthQuerySchema, required: true })
    @ApiOkResponse({ type: WalletUpdatedNotification })
    notifyWalletUpdated(@User("id") userId: number): Observable<WalletUpdatedNotification> {
        return this.notify(WalletUpdatedEvent, userId);
    }

    @Sse("/items-added")
    @ApiOperation({ summary: "인벤토리에 아이템 추가됨 알림" })
    @ApiQuery({ type: AuthQuerySchema, required: true })
    @ApiOkResponse({ type: UserItemsAddedNotification })
    notifyUserItemsAdded(@User("id") userId: number): Observable<UserItemsAddedNotification> {
        return this.notify(UserItemsAddedEvent, userId);
    }

    @Sse("/skills-unlocked")
    @ApiOperation({ summary: "스킬 해금 알림" })
    @ApiQuery({ type: AuthQuerySchema, required: true })
    @ApiOkResponse({ type: UserSkillsAddedNotification })
    notifyUserSkillsAdded(@User("id") userId: number): Observable<UserSkillsAddedNotification> {
        return this.notify(UserSkillsAddedEvent, userId);
    }


    private notify<EventT extends { userId: number; }>(
        Event: { new (...args: any[]): EventT },
        userId: number
    ): Observable<Omit<EventT, "userId">> {
        return this._eventBus.pipe(
            ofType(Event),
            filter((msg: EventT) => msg.userId === userId),
            map(({ userId, ...rest }) => rest),
            tap(result => this._logger.log(result))
        );
    }

}
