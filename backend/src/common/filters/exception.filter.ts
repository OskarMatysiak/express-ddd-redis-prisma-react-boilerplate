import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ZodError) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Validation error', errors: exception.flatten() });
    }

    if (exception instanceof AppError) {
      return response
        .status(exception.statusCode)
        .json({ message: exception.message });
    }

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    console.error(exception);
    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
}
