import { Component, inject } from '@angular/core';
import { NavbarComponent } from '@presentation/templates/navbar/navbar.component';
import { TasksListComponent } from '@presentation/templates/tasks/tasks-list/tasks-list.component';
import { TaskStore } from '@data/store/tasks.store';
import { Task } from '@data/services/task.service';

@Component({
  selector: 'app-task-admin',
  imports: [NavbarComponent, TasksListComponent],
  templateUrl: './task-admin.component.html',
  standalone: true,
  styleUrl: './task-admin.component.css',
})
export class TaskAdminComponent {
  readonly taskStore = inject(TaskStore);

  getPendingTasksCount(): number {
    return this.taskStore.allTasks().filter((task: Task) => !task.isCompleted).length;
  }

  getCompletedTasksCount(): number {
    return this.taskStore.allTasks().filter((task: Task) => task.isCompleted).length;
  }
}
