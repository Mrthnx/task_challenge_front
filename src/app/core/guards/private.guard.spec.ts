import { Router } from '@angular/router';
import { privateGuard } from './private.guard';
import { AuthService } from '@data/services/auth.service';
import {
  EnvironmentInjector,
  EnvironmentInjector as EnvInjector,
  runInInjectionContext,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('privateGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let injector: EnvInjector;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', [
      'userInfo',
    ]);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    runInInjectionContext(
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          { provide: Router, useValue: mockRouter },
        ],
      }),
      () => {
        injector = TestBed.inject(EnvironmentInjector);
      },
    );
  });

  it('should return true when user has token', () => {
    mockAuthService.userInfo.and.returnValue({
      id: 1,
      email: 'test@test.com',
      token: 'test',
    });

    const result = runInInjectionContext(injector, () =>
      privateGuard({} as any, {} as any),
    );
    expect(result).toBeTrue();
  });

  it('should return false and navigate when no token', () => {
    mockAuthService.userInfo.and.returnValue(null);

    const result = runInInjectionContext(injector, () =>
      privateGuard({} as any, {} as any),
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(result).toBeFalse();
  });
});
