import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '@data/services/auth.service';
import { TaskStore } from '@data/store/tasks.store';
import { ReactiveFormsModule } from '@angular/forms';
import { signal, WritableSignal } from '@angular/core';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let querySignal: WritableSignal<string>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['logout'],
      {
        userInfo: signal({
          id: 1,
          email: 'test@example.com',
          token: 'abc123',
        }),
      },
    );
    querySignal = signal('');
    const mockTaskStore = {
      query: querySignal,
    } as Partial<TaskStore>;

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TaskStore, useValue: mockTaskStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create navbar component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchControl', () => {
    expect(component.searchControl).toBeTruthy();
    expect(component.searchControl.value).toBe('');
  });

  it('should call logout from AuthService', () => {
    component.handleLogout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should update TaskStore query on search input after debounce', fakeAsync(() => {
    expect(querySignal()).toBe('');

    component.searchControl.setValue('test');
    tick(100);

    expect(querySignal()).toBe('test');
  }));
});
