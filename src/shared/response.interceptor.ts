import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GlobalResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp()?.getRequest?.();
    const res = context.switchToHttp()?.getResponse?.();

    return next.handle().pipe(
      map((data) => {
        this.logger.debug(`[${req?.method}] ${req?.url}`);
        const statusCode = res?.statusCode ?? 200;

        // If handler already returns unified shape, pass through
        if (data && typeof data === 'object' && 'message' in data && 'code' in data) {
          data.timestamp = new Date().toISOString()
          data.path = req?.url
          return data;
        }

        let message = 'OK';
        // If handler returns a string, treat it as message
        if (data && typeof data === 'object' && 'message' in data) {
          message = data.message;
          delete data.message;
        }

        if (typeof data === 'string') {
          message = data;
          data = undefined;
        }

        const payload = {
          code: 200,
          message,
          data,
          timestamp: new Date().toISOString(),
          path: req?.url,
        };

        this.logger.debug(`[${req?.method}] ${req?.url} ${statusCode}`);
        return payload;
      }),
    );
  }
}