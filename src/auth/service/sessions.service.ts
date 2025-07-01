import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import * as crypto from "node:crypto";

@Injectable()
export class SessionsService {

    constructor(
       @Inject(Redis)
       private readonly _redis: Redis
    ) {}

    async createSession(userId: number): Promise<string> {

        const sessionId = crypto.randomUUID()
            .replaceAll('-', '');

        await this._redis.set(`user/${userId}`, sessionId);
        return sessionId;
    }

    async verifySession(userId: number, sessionId: string): Promise<boolean> {
       return sessionId === await this._redis.get(`user/${userId}`);
    }

    async destroySession(userId: number): Promise<void> {
        await this._redis.del(`user/${userId}`);
    }


}