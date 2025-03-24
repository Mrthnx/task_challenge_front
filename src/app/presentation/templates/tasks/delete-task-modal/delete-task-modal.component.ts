import {Component, inject, input} from '@angular/core';
import {Task} from '@data/services/task.service';
import {ModalRef} from '../../../../core/classes/modal-ref';
import {TaskStore} from '@data/store/tasks.store';

@Component({
  selector: 'app-delete-task-dialog',
  imports: [],
  templateUrl: './delete-task-modal.component.html',
  standalone: true,
  styleUrl: './delete-task-modal.component.css',
})
export class DeleteTaskModalComponent {
  readonly modalRef = inject(ModalRef);
  readonly taskStore = inject(TaskStore);

  task = input<Task>();

  handleConfirm() {
    this.taskStore.deleteTask(this.task()?.id ?? 0).subscribe({
      next: () => this.modalRef.close(true),
      error: (err) => console.log(err),
    });
  }

  handleCancel() {
    this.modalRef.close();
  }
}
