import { HttpException, HttpStatus } from '@nestjs/common';
import type { ErrorCode } from '../constants/error-code.enum.js';
import type { ApiErrorDetail, ApiErrorResponse } from '../interfaces/api-response.interface.js';

export class ApiException extends HttpException {
  constructor(
    status: HttpStatus,
    code: ErrorCode,
    message: string,
    details?: ApiErrorDetail[],
  ) {
    const body: ApiErrorResponse = {
      success: false,
      message,
      error: {
        code,
        ...(details?.length ? { details } : {}),
      },
    };
    super(body, status);
  }
}
