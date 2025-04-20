import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException, QueryFailedError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : 500;

    let errorResponse: string | Record<string, any> = 'Internal Server Error';

    if (exception instanceof HttpException) {
      errorResponse = exception.getResponse();
    } else if (exception instanceof QueryFailedError) {
      errorResponse =
        exception.driverError &&
        (exception.driverError as { code?: string }).code === '23505'
          ? 'Label already exists in this category'
          : 'Internal Server Error';
    }

    const message =
      typeof errorResponse === 'string'
        ? errorResponse
        : errorResponse['message'];

    response.status(statusCode).json({
      status: 'fail',
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
