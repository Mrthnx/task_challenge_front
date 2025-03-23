import { Component, inject, OnInit } from '@angular/core';
import { ModalRef } from '../../../../core/classes/modal-ref';
import { Task, TaskService } from '@data/services/task.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface CreateTaskForm {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  isCompleted: FormControl<boolean | null>;
}

@Component({
  selector: 'app-create-task-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './create-task-modal.component.html',
  standalone: true,
  styleUrl: './create-task-modal.component.css',
})
export class CreateTaskModalComponent implements OnInit {
  readonly modalRef = inject(ModalRef);
  readonly taskService = inject(TaskService);
  readonly formBuilder = inject(FormBuilder);

  taskForm!: FormGroup<CreateTaskForm>;

  ngOnInit() {
    this.initForm();
  }

  handleSubmit() {
    if (!this.taskForm.valid) return;

    const newTask = this.taskForm.value;

    this.taskService.createTask(newTask as Task).subscribe({
      next: (res) => {
        this.modalRef.close(res);
      },
      error: (err) => console.log(err),
    });
  }

  handleCancel() {
    this.modalRef.close();
  }

  private initForm() {
    this.taskForm = this.formBuilder.group<CreateTaskForm>({
      title: this.formBuilder.control(null, [Validators.required]),
      description: this.formBuilder.control(null, [Validators.required]),
      isCompleted: this.formBuilder.control(false),
    });
  }
}
