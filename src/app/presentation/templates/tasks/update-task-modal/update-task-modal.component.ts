import { Component, inject, input, OnInit } from '@angular/core';
import { ModalRef } from '../../../../core/classes/modal-ref';
import { Task, TaskService } from '@data/services/task.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { DatePipe } from '@angular/common';

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
  readonly taskService = inject(TaskService);
  readonly formBuilder = inject(FormBuilder);

  readonly modalService = inject(ModalService);

  task = input<Task>();

  taskForm!: FormGroup<UpdateTaskForm>;

  ngOnInit() {
    this.initForm();
  }

  handleUpdate() {
    if (!this.taskForm.valid) return;

    const newTask = this.taskForm.value;

    this.taskService
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
    this.modalRef.close('delete');
  }

  private initForm() {
    this.taskForm = this.formBuilder.group<UpdateTaskForm>({
      title: this.formBuilder.control(this.task()?.title ?? ''),
      description: this.formBuilder.control(this.task()?.description ?? ''),
    });
  }
}
