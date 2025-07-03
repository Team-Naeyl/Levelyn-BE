import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Request } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const { method, url, headers, query, body  } = ctx.switchToHttp().getRequest<Request>();

        Logger.log(
            { headers, query, body  },
            `[Request] ${method} ${url}`
        );

        return next.handle().pipe(
            tap(() => {
                const delay = `${Date.now() - now}ms`;
                Logger.log(
                    { delay },
                    `[Response] ${method} ${url}`
                )
            }),
        );
    }

}

