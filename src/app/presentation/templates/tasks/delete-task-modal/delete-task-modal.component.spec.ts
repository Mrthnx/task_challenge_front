import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DeleteTaskModalComponent} from './delete-task-modal.component';
import {TaskStore} from '@data/store/tasks.store';
import {of} from 'rxjs';
import {Task} from '@data/services/task.service';
import {ModalRef} from '../../../../core/classes/modal-ref';

describe('DeleteTaskModalComponent', () => {
  let component: DeleteTaskModalComponent;
  let fixture: ComponentFixture<DeleteTaskModalComponent>;
  let mockModalRef: jasmine.SpyObj<ModalRef<any>>;
  let mockTaskStore: jasmine.SpyObj<TaskStore>;

  const mockTask: Task = {
    id: 42,
    title: 'Tarea de prueba',
    description: 'Lorem',
    isCompleted: false,
    createDate: new Date(),
    updateDate: new Date()
  };

  beforeEach(async () => {
    mockModalRef = jasmine.createSpyObj<ModalRef<any>>('ModalRef', ['close']);
    mockTaskStore = jasmine.createSpyObj<TaskStore>('TaskStore', ['deleteTask']);

    await TestBed.configureTestingModule({
      imports: [DeleteTaskModalComponent],
      providers: [
        {provide: ModalRef, useValue: mockModalRef},
        {provide: TaskStore, useValue: mockTaskStore},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTaskModalComponent);
    fixture.componentRef.setInput('task', mockTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.task()).toEqual(mockTask);
  });

  it('should call deleteTask and close modal with true on confirm', () => {
    mockTaskStore.deleteTask.and.returnValue(of({}));

    component.handleConfirm();

    expect(mockTaskStore.deleteTask).toHaveBeenCalledWith(42);
    expect(mockModalRef.close).toHaveBeenCalledWith(true);
  });

  it('should close modal without value on cancel', () => {
    component.handleCancel();
    expect(mockModalRef.close).toHaveBeenCalledWith();
  });
});
