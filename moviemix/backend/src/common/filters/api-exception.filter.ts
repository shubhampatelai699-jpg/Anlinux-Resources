import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from '../exceptions/api.exception';

@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as Record<string, any>;

    if (exception instanceof ApiException) {
      response.status(status).json(exception.getResponse());
      return;
    }

    response.status(status).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: exceptionResponse.message || 'Something went wrong',
      },
      requestId: '',
    });
  }
}
