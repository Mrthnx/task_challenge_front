import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '@data/services/auth.service';
import {inject} from '@angular/core';

export const privateGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.userInfo()?.token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
