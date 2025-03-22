import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '@presentation/templates/navbar/navbar.component';
import { TasksListComponent } from '@presentation/templates/tasks/tasks-list/tasks-list.component';
import { Task, TaskService } from '@data/services/task.service';

@Component({
  selector: 'app-task-admin',
  imports: [NavbarComponent, TasksListComponent],
  templateUrl: './task-admin.component.html',
  standalone: true,
  styleUrl: './task-admin.component.css',
})
export class TaskAdminComponent implements OnInit {
  readonly taskService = inject(TaskService);

  allTasks = signal<Task[]>([]);

  ngOnInit() {
    this.taskService.getTasks().subscribe((res) => {
      this.allTasks.set(res);
    });
  }
}
