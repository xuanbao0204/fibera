import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ErrorCode } from '../constants/error-code.enum.js';
import type { ApiErrorResponse } from '../interfaces/api-response.interface.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let body: ApiErrorResponse;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'success' in exceptionResponse &&
        'error' in exceptionResponse
      ) {
        body = exceptionResponse as ApiErrorResponse;
      } else {
        body = {
          success: false,
          message:
            typeof exceptionResponse === 'string'
              ? exceptionResponse
              : exception.message,
          error: { code: `HTTP_${status}` },
        };
      }
    } else {
      body = {
        success: false,
        message: 'Internal server error',
        error: { code: ErrorCode.INTERNAL_SERVER_ERROR },
      };
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(body);
  }
}
