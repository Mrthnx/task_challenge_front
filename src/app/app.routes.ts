import { Routes } from '@angular/router';
import { publicGuard } from './core/guards/public.guard';
import { privateGuard } from './core/guards/private.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@presentation/pages/sign-in/sign-in.component').then(
        (m) => m.SignInComponent,
      ),
    canActivate: [publicGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('@presentation/pages/task-admin/task-admin.component').then(
        (m) => m.TaskAdminComponent,
      ),
    canActivate: [privateGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
