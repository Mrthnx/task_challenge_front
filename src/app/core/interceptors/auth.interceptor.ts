import {HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from '@data/services/auth.service';
import {inject} from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  if (authService.userInfo()?.token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.userInfo()?.token}`
      }
    });

    return next(clonedReq);
  }

  return next(req);
};
