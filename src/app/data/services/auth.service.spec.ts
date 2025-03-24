import { TestBed } from '@angular/core/testing';
import { AuthService, UserInfo } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUserInfo: UserInfo = {
    id: 1,
    email: 'test@example.com',
    token: 'abc123',
  };

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'userInfo') {
        return null;
      }
      return null;
    });

    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'removeItem').and.stub();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: mockRouter }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /login and store user info if token is returned', () => {
    service.validateEmail('test@example.com').subscribe();

    const req = httpMock.expectOne(`${service['apiUrl']}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    req.flush({ data: mockUserInfo });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'userInfo',
      JSON.stringify(mockUserInfo),
    );
    expect(service.userInfo()).toEqual(mockUserInfo);
  });

  it('should call POST /register and store user info if token is returned', () => {
    service.registerEmail('test@example.com').subscribe();

    const req = httpMock.expectOne(`${service['apiUrl']}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    req.flush({ data: mockUserInfo });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'userInfo',
      JSON.stringify(mockUserInfo),
    );
    expect(service.userInfo()).toEqual(mockUserInfo);
  });

  it('should clear user info and navigate to / on logout', () => {
    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('userInfo');
    expect(service.userInfo()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
