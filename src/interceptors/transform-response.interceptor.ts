import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseInterface } from '../interface/response.interface';

export interface Response<T> {
  status: number;
  message: string;
  data?: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, ResponseInterface>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseInterface> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        const message = data ? data.message : '';
        const dataResponse = data;
        const status =
          data && data.status
            ? data.status
            : context.switchToHttp().getResponse().statusCode;
        if (dataResponse && typeof dataResponse === 'object') {
          delete dataResponse.message;
          delete dataResponse.status;
        }
        res.status(status);
        return {
          status: status,
          message: message ? message : '',
          data: dataResponse ? dataResponse.data : null,
        };
      }),
    );
  }
}
