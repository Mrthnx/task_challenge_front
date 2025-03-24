import {Component, inject, input, OnInit} from '@angular/core';
import {ModalRef} from '../../../../core/classes/modal-ref';
import {Task} from '@data/services/task.service';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule,} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {TaskStore} from '@data/store/tasks.store';

interface UpdateTaskForm {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
}

@Component({
  selector: 'app-update-task-dialog',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './update-task-modal.component.html',
  standalone: true,
  styleUrl: './update-task-modal.component.css',
})
export class UpdateTaskModalComponent implements OnInit {
  readonly modalRef = inject(ModalRef);
  readonly taskStore = inject(TaskStore);
  readonly formBuilder = inject(FormBuilder);

  task = input<Task>();

  taskForm!: FormGroup<UpdateTaskForm>;

  ngOnInit() {
    this.initForm();
  }

  handleUpdate() {
    if (!this.taskForm.valid) return;

    const newTask = this.taskForm.value;

    this.taskStore
      .updateTask(newTask as Task, this.task()?.id ?? 0)
      .subscribe({
        next: (res) => {
          this.modalRef.close(res);
        },
        error: (err) => console.log(err),
      });
  }

  handleCancel() {
    this.modalRef.close();
  }

  removeTask() {
    this.taskStore.deleteTask(this.task()?.id ?? 0).subscribe({
      next: () => this.modalRef.close(true),
      error: (err) => console.log(err),
    });
  }

  private initForm() {
    this.taskForm = this.formBuilder.group<UpdateTaskForm>({
      title: this.formBuilder.control(this.task()?.title ?? ''),
      description: this.formBuilder.control(this.task()?.description ?? ''),
    });
  }
}
