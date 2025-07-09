import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { SseResponse } from "./sse.response";

@Injectable()
export class SseInterceptor implements NestInterceptor<any, SseResponse> {
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<SseResponse> {
        return next.handle().pipe(
                map(data => ({ data }))
            );
    }
}