import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GlobalExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GlobalExceptionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp()?.getRequest?.();

    return next.handle().pipe(
      catchError((err) => {
        const isHttp = err instanceof HttpException;
        const status = isHttp ? err.getStatus() : 500;

        // normalize message from HttpException or generic Error
        let response = isHttp ? err.getResponse() : undefined;
        let message: string = 'Internal server error';

        if (typeof response === 'string') {
          message = response;
        } else if (response && typeof response === 'object') {
          message = (response as any).message || (response as any).error || message;
        } else if (err?.message) {
          message = err.message;
        }

        const payload = {
          code: status,
          message,
          timestamp: new Date().toISOString(),
          path: req?.url,
        };

        this.logger.error(`[${req?.method}] ${req?.url} ${status} - ${message}`, err?.response?.stack);
        // Re-throw as HttpException to ensure consistent JSON response body
        return throwError(() => new HttpException(payload, status));
      }),
    );
  }
}