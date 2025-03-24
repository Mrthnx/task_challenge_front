import { Component } from '@angular/core';
import { NavbarComponent } from '@presentation/templates/navbar/navbar.component';
import { TasksListComponent } from '@presentation/templates/tasks/tasks-list/tasks-list.component';

@Component({
  selector: 'app-task-admin',
  imports: [NavbarComponent, TasksListComponent],
  templateUrl: './task-admin.component.html',
  standalone: true,
  styleUrl: './task-admin.component.css',
})
export class TaskAdminComponent {}
