import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { HTTP_STATUS_CODES } from '../constants/http.constant';

export const notauthInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === HTTP_STATUS_CODES.UNAUTHORIZED &&
        error.url?.includes('task')
      ) {
        alert('Session Expired');
        localStorage.removeItem('userInfo');
        window.location.href = '/';
      }
      return throwError(() => error);
    }),
  );
};
