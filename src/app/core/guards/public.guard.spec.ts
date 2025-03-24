import { Router } from '@angular/router';
import { publicGuard } from './public.guard';
import { AuthService } from '@data/services/auth.service';
import { TestBed } from '@angular/core/testing';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';

describe('publicGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', [
      'userInfo',
    ]);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should return true when there is no token', () => {
    mockAuthService.userInfo.and.returnValue(null);

    const result = runInInjectionContext(
      TestBed.inject(EnvironmentInjector),
      () => publicGuard({} as any, {} as any),
    );

    expect(result).toBeTrue();
  });

  it('should return false and navigate to /admin when there is a token', () => {
    mockAuthService.userInfo.and.returnValue({
      id: 1,
      email: 'test@test.com',
      token: 'test',
    });

    const result = runInInjectionContext(
      TestBed.inject(EnvironmentInjector),
      () => publicGuard({} as any, {} as any),
    );

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
    expect(result).toBeFalse();
  });
});
