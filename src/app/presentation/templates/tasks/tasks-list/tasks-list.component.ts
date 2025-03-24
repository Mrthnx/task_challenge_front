import { Component, inject } from '@angular/core';
import { Task } from '@data/services/task.service';
import { DatePipe, NgClass } from '@angular/common';
import { DeleteTaskModalComponent } from '@presentation/templates/tasks/delete-task-modal/delete-task-modal.component';
import { ModalService } from '../../../../core/services/modal.service';
import { UpdateTaskModalComponent } from '@presentation/templates/tasks/update-task-modal/update-task-modal.component';
import { CreateTaskModalComponent } from '@presentation/templates/tasks/create-task-modal/create-task-modal.component';
import { TaskStore } from '@data/store/tasks.store';

@Component({
  selector: 'app-tasks-list',
  imports: [DatePipe, NgClass],
  templateUrl: './tasks-list.component.html',
  standalone: true,
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent {
  readonly taskStore = inject(TaskStore);
  readonly modalService = inject(ModalService);

  constructor() {
    this.taskStore.loadTasks();
  }

  handleTaskCheckboxChange(task: Task) {
    this.taskStore.markAsCompleted(task.id).subscribe();
  }

  handleDeleteTask(task: Task) {
    this.modalService.open(DeleteTaskModalComponent, {
      task,
    });
  }

  handleUpdateTask(task: Task) {
    this.modalService.open(UpdateTaskModalComponent, {
      task,
    });
  }

  handleCreateTask() {
    this.modalService.open(CreateTaskModalComponent);
  }
}
