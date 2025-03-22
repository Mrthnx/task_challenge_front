import {Component, inject, input} from '@angular/core';
import {Task, TaskService} from '@data/services/task.service';
import {ModalRef} from '../../../../core/classes/modal-ref';

@Component({
  selector: 'app-delete-task-dialog',
  imports: [],
  templateUrl: './delete-task-modal.component.html',
  standalone: true,
  styleUrl: './delete-task-modal.component.css'
})
export class DeleteTaskModalComponent {

  readonly modalRef = inject(ModalRef);
  readonly taskService = inject(TaskService);

  task = input<Task>();

  handleConfirm() {
    this.taskService
      .deleteTask(this.task()?.id ?? 0)
      .subscribe({
        next: () => this.modalRef.close(true),
        error: err => console.log(err)
      });
  }

  handleCancel() {
    this.modalRef.close();
  }
}
