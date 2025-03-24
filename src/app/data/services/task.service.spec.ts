import { TestBed } from '@angular/core/testing';
import { Task, TaskService } from './task.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Description',
    isCompleted: false,
    createDate: new Date(),
    updateDate: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get tasks (with default search)', () => {
    service.getTasks().subscribe((tasks) => {
      expect(tasks).toEqual([mockTask]);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/tasks?search=`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [mockTask] });
  });

  it('should get tasks (with search value)', () => {
    service.getTasks('test').subscribe((tasks) => {
      expect(tasks).toEqual([mockTask]);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/tasks?search=test`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [mockTask] });
  });

  it('should mark task as completed', () => {
    service.markAsCompleted(1).subscribe();

    const req = httpMock.expectOne(`${service['apiUrl']}/tasks/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should create a task', () => {
    service.createTask(mockTask).subscribe((res) => {
      expect(res).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockTask);
    req.flush({ data: mockTask });
  });

  it('should update a task', () => {
    service.updateTask(mockTask, 1).subscribe((res) => {
      expect(res).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/tasks/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockTask);
    req.flush({ data: mockTask });
  });

  it('should delete a task', () => {
    service.deleteTask(1).subscribe();

    const req = httpMock.expectOne(`${service['apiUrl']}/tasks/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
