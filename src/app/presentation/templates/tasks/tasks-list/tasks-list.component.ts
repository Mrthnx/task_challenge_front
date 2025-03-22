import { Component, inject, input, linkedSignal } from '@angular/core';
import { Task, TaskService } from '@data/services/task.service';
import { DatePipe, NgClass } from '@angular/common';
import { DeleteTaskModalComponent } from '@presentation/templates/tasks/delete-task-modal/delete-task-modal.component';
import { ModalService } from '../../../../core/services/modal.service';
import { UpdateTaskModalComponent } from '@presentation/templates/tasks/update-task-modal/update-task-modal.component';
import { CreateTaskModalComponent } from '@presentation/templates/tasks/create-task-modal/create-task-modal.component';

@Component({
  selector: 'app-tasks-list',
  imports: [DatePipe, NgClass],
  templateUrl: './tasks-list.component.html',
  standalone: true,
  styleUrl: './tasks-list.component.css',
})
export class TasksListComponent {
  readonly taskService = inject(TaskService);
  readonly modalService = inject(ModalService);

  tasks = input<Task[]>([]);
  visibleTasks = linkedSignal(this.tasks);

  handleTaskCheckboxChange(task: Task) {
    this.taskService.markAsCompleted(task.id).subscribe((res) => {
      this.visibleTasks.update((tasks) => {
        return tasks
          .map((t) => {
            if (t.id === task.id) {
              return { ...t, isCompleted: !t.isCompleted };
            }
            return t;
          })
          .sort((a, b) => (!a.isCompleted ? -1 : 1));
      });
    });
  }
  andleDeleteTask(task: Task) {
    const modal = this.modalService.open(DeleteTaskModalComponent, {
      task,
    });

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.visibleTasks.update((tasks) => {
          return tasks.filter((t) => t.id !== task.id);
        });
      }
    });
  }

  handleUpdateTask(task: Task) {
    const modal = this.modalService.open(UpdateTaskModalComponent, {
      task,
    });

    modal.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.andleDeleteTask(task);
        return;
      }

      if (result) {
        this.visibleTasks.update((tasks) => {
          return tasks
            .map((t) => {
              if (t.id === task.id) {
                return { ...t, ...result };
              }
              return t;
            })
            .sort((a, b) => (!a.isCompleted ? -1 : 1));
        });
      }
    });
  }

  handleCreateTask() {
    const modal = this.modalService.open(CreateTaskModalComponent);

    modal.afterClosed().subscribe((result) => {
      if (result) {
        this.visibleTasks.update((tasks) => [...tasks, result]);
      }
    });
  }
}
