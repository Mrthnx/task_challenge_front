import {ComponentFixture, TestBed} from '@angular/core/testing';
import {UpdateTaskModalComponent} from './update-task-modal.component';
import {TaskStore} from '@data/store/tasks.store';
import {of} from 'rxjs';
import {Task} from '@data/services/task.service';
import {ModalRef} from '../../../../core/classes/modal-ref';

describe('UpdateTaskModalComponent', () => {
  let component: UpdateTaskModalComponent;
  let fixture: ComponentFixture<UpdateTaskModalComponent>;
  let mockModalRef: jasmine.SpyObj<ModalRef<any>>;
  let mockTaskStore: jasmine.SpyObj<TaskStore>;

  const mockTask: Task = {
    id: 10,
    title: 'Original Task',
    description: 'Some desc',
    isCompleted: false,
    createDate: new Date(),
    updateDate: new Date(),
  };

  beforeEach(async () => {
    mockModalRef = jasmine.createSpyObj<ModalRef<any>>('ModalRef', ['close']);
    mockTaskStore = jasmine.createSpyObj<TaskStore>('TaskStore', ['updateTask', 'deleteTask']);

    await TestBed.configureTestingModule({
      imports: [UpdateTaskModalComponent],
      providers: [
        {provide: ModalRef, useValue: mockModalRef},
        {provide: TaskStore, useValue: mockTaskStore},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateTaskModalComponent);
    fixture.componentRef.setInput('task', mockTask);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component and initialize form with task data', () => {
    expect(component).toBeTruthy();
    expect(component.taskForm.value.title).toBe('Original Task');
    expect(component.taskForm.value.description).toBe('Some desc');
  });

  it('should call updateTask and close modal on update', () => {
    const updated = {
      title: 'Updated title',
      description: 'Updated desc',
    };

    component.taskForm.setValue(updated);
    mockTaskStore.updateTask.and.returnValue(of({...mockTask, ...updated}));

    component.handleUpdate();

    expect(mockTaskStore.updateTask).toHaveBeenCalledWith(jasmine.objectContaining(updated), 10);
    expect(mockModalRef.close).toHaveBeenCalledWith(jasmine.objectContaining(updated));
  });

  it('should close modal on cancel', () => {
    component.handleCancel();
    expect(mockModalRef.close).toHaveBeenCalled();
  });

  it('should call deleteTask and close modal with true', () => {
    mockTaskStore.deleteTask.and.returnValue(of({}));

    component.removeTask();

    expect(mockTaskStore.deleteTask).toHaveBeenCalledWith(10);
    expect(mockModalRef.close).toHaveBeenCalledWith(true);
  });
});
