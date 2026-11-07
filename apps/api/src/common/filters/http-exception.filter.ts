import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponseBody {
  statusCode: number;
  path: string;
  timestamp: string;
  message: string | string[];
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception, isHttpException);

    if (!isHttpException) {
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );
    }

    const body: ErrorResponseBody = {
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
    };

    response.status(status).json(body);
  }

  private extractMessage(
    exception: unknown,
    isHttpException: boolean,
  ): string | string[] {
    if (isHttpException) {
      const response = (exception as HttpException).getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        return (response as { message: string | string[] }).message;
      }
    }
    return 'Internal server error';
  }
}
