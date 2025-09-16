import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class UpsertResumeEntityDtoFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const timestamp = new Date().toISOString();

    let message = '이력서 엔티티 DTO 타입이 잘못되었습니다.';
    let validationErrors: any[] = [];

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;

      if (responseObj.message) {
        if (Array.isArray(responseObj.message)) {
          validationErrors = responseObj.message.map((errorMsg: string) => {
            const match = errorMsg.match(/^(\w+(?:\.\d+\.\w+)?)\s/);
            if (match) {
              const field = match[1];

              if (field.startsWith('items.')) {
                const parts = field.split('.');
                const index = parseInt(parts[1]);
                const subField = parts[2];

                return {
                  field: `items[${index}].${subField}`,
                  type: subField,
                  index,
                };
              } else {
                return {
                  field,
                  type: field,
                };
              }
            }

            return { field: errorMsg, type: 'unknown' };
          });
        } else {
          message = responseObj.message;
        }
      }
    }

    res.status(status).json({
      statusCode: status,
      timestamp,
      path: req.url,
      message,
      validationErrors,
    });
  }
}
