import { TestBed } from '@angular/core/testing';
import { Task, TaskService } from '@data/services/task.service';
import { of } from 'rxjs';
import { TaskStore } from '@data/store/tasks.store';

describe('TaskStore', () => {
  let store: TaskStore;
  let mockTaskService: jasmine.SpyObj<TaskService>;

  const taskA: Task = {
    id: 1,
    title: 'Tarea A',
    description: 'Desc A',
    isCompleted: false,
    createDate: new Date(),
    updateDate: new Date(),
  };

  const taskB: Task = {
    id: 2,
    title: 'Otra',
    description: 'Desc B',
    isCompleted: true,
    createDate: new Date(),
    updateDate: new Date(),
  };

  beforeEach(() => {
    mockTaskService = jasmine.createSpyObj<TaskService>('TaskService', [
      'getTasks',
      'createTask',
      'updateTask',
      'deleteTask',
      'markAsCompleted',
    ]);

    mockTaskService.getTasks.and.returnValue(of([taskA, taskB]));

    TestBed.configureTestingModule({
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    });

    store = TestBed.inject(TaskStore);
    store.loadTasks();
  });

  it('should be created and load initial tasks', () => {
    expect(store).toBeTruthy();
    expect(store.allTasks()).toEqual([taskA, taskB]);
  });

  it('should filter tasks based on query', () => {
    store.query.set('otra'); // busca por título
    const filtered = store.filteredTasks();
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe(2);
  });

  it('should add a task to the list', (done) => {
    const newTask = { ...taskA, id: 3 };
    mockTaskService.createTask.and.returnValue(of(newTask));

    store.addTask(newTask).subscribe(() => {
      expect(store.allTasks().some((t) => t.id === 3)).toBeTrue();
      done();
    });
  });

  it('should update an existing task', (done) => {
    const updated = { ...taskA, title: 'Actualizado' };
    mockTaskService.updateTask.and.returnValue(of(updated));

    store.updateTask(updated, updated.id).subscribe(() => {
      const updatedTask = store.allTasks().find((t) => t.id === updated.id);
      expect(updatedTask?.title).toBe('Actualizado');
      done();
    });
  });

  it('should delete a task', (done) => {
    mockTaskService.deleteTask.and.returnValue(of({}));

    store.deleteTask(1).subscribe(() => {
      const exists = store.allTasks().some((t) => t.id === 1);
      expect(exists).toBeFalse();
      done();
    });
  });

  it('should toggle isCompleted when marking as completed', (done) => {
    mockTaskService.markAsCompleted.and.returnValue(of({}));

    store.markAsCompleted(1).subscribe(() => {
      const task = store.allTasks().find((t) => t.id === 1);
      expect(task?.isCompleted).toBeTrue();
      done();
    });
  });
});
