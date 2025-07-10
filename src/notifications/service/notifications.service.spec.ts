import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { NOTIFICATION_BLOCK_TIMEOUT } from '../token';
import { UserNotification } from '../notification';


describe('NotificationsService', () => {
    let service: NotificationsService;
    let redisMock: Partial<Redis>;
    let loggerSpy: jest.SpyInstance;
    const list: string[] = [];

    beforeEach(async () => {
        redisMock = {
            rpush: jest.fn().mockImplementation(

            ),
            lpop: jest.fn()
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsService,
                { provide: Redis, useValue: redisMock },
                { provide: NOTIFICATION_BLOCK_TIMEOUT, useValue: 10 },
            ],
        }).compile();

        service = module.get<NotificationsService>(NotificationsService);
        loggerSpy = jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should add a user notification', async () => {
        const notification = new UserNotification(" event", {});

        await service.addUserNotification(1, notification);
        expect(redisMock.rpush).toHaveBeenCalledWith(
            'user:1',
            JSON.stringify(notification)
        );
    });

    it('should emit parsed notifications from Redis', async () => {
        const notificationRaw = JSON.stringify({
            type: 'info',
            message: 'Hi',
            timestamp: new Date().toISOString()
        });

        let callCount = 0;
        redisMock.lpop = jest.fn()
            .mockImplementation(async () => {
                callCount++;
                return callCount === 1 ? notificationRaw : null;
            });

        const iterator = service.getUserNotifications(1)[Symbol.asyncIterator]();
        const first = await iterator.next();
        expect(first.value).toEqual(JSON.parse(notificationRaw));
    });
});
