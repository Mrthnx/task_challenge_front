import { Component, computed, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '@presentation/templates/navbar/navbar.component';
import { TasksListComponent } from '@presentation/templates/tasks/tasks-list/tasks-list.component';
import { TaskService } from '@data/services/task.service';
import { TaskStore } from '@data/store/tasks.store';

@Component({
  selector: 'app-task-admin',
  imports: [NavbarComponent, TasksListComponent],
  templateUrl: './task-admin.component.html',
  standalone: true,
  styleUrl: './task-admin.component.css',
})
export class TaskAdminComponent implements OnInit {
  readonly taskService = inject(TaskService);
  readonly tasksStore = inject(TaskStore);

  allTasks = computed(() => this.tasksStore.getTasks());

  ngOnInit() {
    this.taskService.getTasks().subscribe((res) => {
      this.tasksStore.setTasks(res);
    });
  }
}
