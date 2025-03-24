import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CreateTaskModalComponent} from './create-task-modal.component';
import {TaskStore} from '@data/store/tasks.store';
import {of} from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';
import {ModalRef} from '../../../../core/classes/modal-ref';

describe('CreateTaskModalComponent', () => {
  let component: CreateTaskModalComponent;
  let fixture: ComponentFixture<CreateTaskModalComponent>;
  let mockModalRef: jasmine.SpyObj<ModalRef<any>>;
  let mockTaskStore: jasmine.SpyObj<TaskStore>;

  beforeEach(async () => {
    mockModalRef = jasmine.createSpyObj<ModalRef<any>>('ModalRef', ['close']);
    mockTaskStore = jasmine.createSpyObj<TaskStore>('TaskStore', ['addTask']);

    await TestBed.configureTestingModule({
      imports: [CreateTaskModalComponent, ReactiveFormsModule],
      providers: [
        {provide: ModalRef, useValue: mockModalRef},
        {provide: TaskStore, useValue: mockTaskStore},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and form', () => {
    expect(component).toBeTruthy();
    expect(component.taskForm).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.taskForm.setValue({
      title: null,
      description: null,
      isCompleted: false
    });

    component.handleSubmit();
    expect(mockTaskStore.addTask).not.toHaveBeenCalled();
    expect(mockModalRef.close).not.toHaveBeenCalled();
  });

  it('should call taskStore.addTask and close modal on success', () => {
    const newTask = {
      title: 'Tarea test',
      description: 'Desc',
      isCompleted: false,
    };

    component.taskForm.setValue(newTask);

    const mockResponse = {...newTask, id: 1};
    mockTaskStore.addTask.and.returnValue(of(mockResponse));

    component.handleSubmit();

    expect(mockTaskStore.addTask).toHaveBeenCalledWith(jasmine.objectContaining(newTask));
    expect(mockModalRef.close).toHaveBeenCalledWith(mockResponse);
  });

  it('should close the modal on cancel', () => {
    component.handleCancel();
    expect(mockModalRef.close).toHaveBeenCalledWith();
  });
});
