import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { HTTP_STATUS_CODES } from '../constants/http.constant';
import { inject } from '@angular/core';
import { AuthService } from '@data/services/auth.service';
import { ModalService } from '../services/modal.service';
import { DialogComponent } from '@presentation/templates/dialog/dialog.component';

export const notauthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const modalService = inject(ModalService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === HTTP_STATUS_CODES.UNAUTHORIZED &&
        !error.url?.includes('login')
      ) {
        const modal = modalService.open(DialogComponent, {
          config: {
            title: 'Sesión Expirada',
            message:
              'Tu sesión ha expirado, por favor, valida tu usuario nuevamente.',
            okButtonText: 'Aceptar',
            cancelButtonText: '',
          },
        });

        modal.afterClosed().subscribe((result) => {
          authService.logout();
        });
      }
      return throwError(() => error);
    }),
  );
};
