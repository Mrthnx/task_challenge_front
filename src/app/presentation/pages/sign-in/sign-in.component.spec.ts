import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@data/services/auth.service';
import { Router } from '@angular/router';
import { DialogComponent } from '@presentation/templates/dialog/dialog.component';
import { of, throwError } from 'rxjs';
import { ModalService } from '../../../core/services/modal.service';
import { HTTP_STATUS_CODES } from '../../../core/constants/http.constant';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockModalService: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', [
      'validateEmail',
      'registerEmail',
    ]);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    mockModalService = jasmine.createSpyObj<ModalService>('ModalService', [
      'open',
    ]);

    await TestBed.configureTestingModule({
      imports: [SignInComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ModalService, useValue: mockModalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and form', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.setValue({ email: '' });
    component.handleFormSubmit();
    expect(mockAuthService.validateEmail).not.toHaveBeenCalled();
  });

  it('should login and navigate on valid form', () => {
    component.loginForm.setValue({ email: 'test@example.com' });
    mockAuthService.validateEmail.and.returnValue(of({}));

    component.handleFormSubmit();

    expect(mockAuthService.validateEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should show modal on 401 and register user if confirmed', () => {
    component.loginForm.setValue({ email: 'test@example.com' });

    // Simula error 401
    mockAuthService.validateEmail.and.returnValue(
      throwError(() => ({ status: HTTP_STATUS_CODES.UNAUTHORIZED })),
    );

    const modalRef = {
      afterClosed: () => of(true), // usuario confirma
    } as any;

    mockModalService.open.and.returnValue(modalRef);
    mockAuthService.registerEmail.and.returnValue(of({}));

    component.handleFormSubmit();

    expect(mockModalService.open).toHaveBeenCalledWith(
      DialogComponent,
      jasmine.any(Object),
    );
    expect(mockAuthService.registerEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should show error message if register fails after modal confirmation', () => {
    component.loginForm.setValue({ email: 'test@example.com' });

    mockAuthService.validateEmail.and.returnValue(
      throwError(() => ({ status: HTTP_STATUS_CODES.UNAUTHORIZED })),
    );

    const modalRef = {
      afterClosed: () => of(true),
    } as any;

    mockModalService.open.and.returnValue(modalRef);
    mockAuthService.registerEmail.and.returnValue(
      throwError(() => new Error('fail')),
    );

    component.handleFormSubmit();

    expect(component.erorrMessage()).toBe(
      'Ocurrió un error, intenta de nuevo.',
    );
  });

  it('should set generic error message if login fails with other error', () => {
    component.loginForm.setValue({ email: 'test@example.com' });

    mockAuthService.validateEmail.and.returnValue(
      throwError(() => ({ status: 500 })),
    );

    component.handleFormSubmit();

    expect(component.erorrMessage()).toBe(
      'Oops! Something went wrong, try again later.',
    );
  });
});
