import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksListComponent } from './tasks-list.component';
import { TaskStore } from '@data/store/tasks.store';
import { of } from 'rxjs';
import { Task } from '@data/services/task.service';
import { DeleteTaskModalComponent } from '@presentation/templates/tasks/delete-task-modal/delete-task-modal.component';
import { UpdateTaskModalComponent } from '@presentation/templates/tasks/update-task-modal/update-task-modal.component';
import { CreateTaskModalComponent } from '@presentation/templates/tasks/create-task-modal/create-task-modal.component';
import { ModalService } from '../../../../core/services/modal.service';
import { computed, signal, Signal, WritableSignal } from '@angular/core';

describe('TasksListComponent', () => {
  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let allTasksSigna: WritableSignal<Task[]>;
  let querySignal: WritableSignal<string>;
  let filteredTasksSignal: Signal<Task[]>;

  const mockTask: Task = {
    id: 1,
    title: 'Test task',
    description: 'Description',
    isCompleted: false,
    createDate: new Date(),
    updateDate: new Date(),
  };

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj<ModalService>('ModalService', [
      'open',
    ]);
    allTasksSigna = signal<Task[]>([mockTask]);
    querySignal = signal('');
    filteredTasksSignal = computed(() => {
      return allTasksSigna().filter((task) => {
        return (
          querySignal().length === 0 ||
          task.title.toLowerCase().includes(querySignal().toLowerCase()) ||
          task.description.toLowerCase().includes(querySignal().toLowerCase())
        );
      });
    });

    const mockTaskStore = {
      query: querySignal,
      filteredTasks: filteredTasksSignal,
      allTasks: allTasksSigna,
      loadTasks: jasmine.createSpy('loadTasks').and.returnValue(void 0),
      markAsCompleted: jasmine
        .createSpy('markAsCompleted')
        .and.returnValue(of({})),
    } as Partial<TaskStore>;

    await TestBed.configureTestingModule({
      imports: [TasksListComponent],
      providers: [
        { provide: TaskStore, useValue: mockTaskStore },
        { provide: ModalService, useValue: mockModalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark task as completed', () => {
    component.handleTaskCheckboxChange(mockTask);

    expect(component.taskStore.markAsCompleted).toHaveBeenCalledWith(
      mockTask.id,
    );
  });

  it('should open delete task modal with task data', () => {
    component.handleDeleteTask(mockTask);

    expect(mockModalService.open).toHaveBeenCalledWith(
      DeleteTaskModalComponent,
      {
        task: mockTask,
      },
    );
  });

  it('should open update task modal with task data', () => {
    component.handleUpdateTask(mockTask);

    expect(mockModalService.open).toHaveBeenCalledWith(
      UpdateTaskModalComponent,
      {
        task: mockTask,
      },
    );
  });

  it('should open create task modal', () => {
    component.handleCreateTask();

    expect(mockModalService.open).toHaveBeenCalledWith(
      CreateTaskModalComponent,
    );
  });
});
