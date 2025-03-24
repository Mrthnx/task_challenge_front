import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAdminComponent } from './task-admin.component';
import { AuthService } from '@data/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskAdminComponent', () => {
  let component: TaskAdminComponent;
  let fixture: ComponentFixture<TaskAdminComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', [
      'userInfo',
    ]);

    await TestBed.configureTestingModule({
      imports: [TaskAdminComponent, HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
