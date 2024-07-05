import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotAcceptableException,
} from '@nestjs/common';
import axios from 'axios';
@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let logResponse = {};

    //DTO Validation Error Handling
    if (exception instanceof NotAcceptableException) {
      logResponse = {
        message: exception.getResponse(),
        meta: {
          method: request.method,
          code: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      };
      let errorLog = JSON.stringify(logResponse);
      this.sendLog('http://localhost:3002/api/v1/error-log', {
        message: errorLog,
      }).then((res) => {});
      let res = { ...logResponse, message: 'Validation Error' };
      response.status(status).json(res);
    } else {
      if (request.url != '/favicon.ico') {
        if (status === 500) {
          logResponse = {
            message: (exception as unknown as Error).stack,
            meta: {
              method: request.method,
              code: status,
              timestamp: new Date().toISOString(),
              path: request.url,
            },
          };

          let errorLog = JSON.stringify(logResponse);
          this.sendLog('http://localhost:3002/api/v1/error-log', {
            message: errorLog,
          }).then((res) => {});
          let res = { ...logResponse, message: 'Server Error' };
          response.status(status).json(res);
        } else if (status === 401) {
          logResponse = {
            message:
              exception instanceof HttpException
                ? exception.message
                : exception,
            meta: {
              method: request.method,
              code: status,
              timestamp: new Date().toISOString(),
              path: request.url,
            },
          };
          let errorLog = JSON.stringify(logResponse);
          this.sendLog('http://localhost:3002/api/v1/error-log', {
            message: errorLog,
          }).then((res) => {});
          response.status(status).json(logResponse);
        } else if (status === 409) {
          logResponse = {
            message:
              exception instanceof HttpException
                ? exception.message
                : exception,
            meta: {
              method: request.method,
              code: status,
              timestamp: new Date().toISOString(),
              path: request.url,
            },
          };
          let errorLog = JSON.stringify(logResponse);
          this.sendLog('http://localhost:3002/api/v1/error-log', {
            message: errorLog,
          }).then((res) => {});
          response.status(status).json(logResponse);
        } else {
          logResponse = {
            message:
              exception instanceof HttpException
                ? exception.message
                : exception,
            meta: {
              method: request.method,
              code: status,
              timestamp: new Date().toISOString(),
              path: request.url,
            },
          };
          let errorLog = JSON.stringify(logResponse);
          this.sendLog('http://localhost:3002/api/v1/error-log', {
            message: errorLog,
          }).then((res) => {});
          let res = { ...logResponse, message: 'Server Error' };
          response.status(status).json(res);
        }
      }
    }
  }

  async sendLog(url: string, body: any) {
    try {
      let options = {
        headers: {
          Accept: 'application/json',
        },
      };
      await axios.post(url, body, options);
    } catch (err) {}
  }
}
