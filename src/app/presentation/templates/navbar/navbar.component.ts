import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@data/services/auth.service';
import { TaskService } from '@data/services/task.service';
import { TaskStore } from '@data/store/tasks.store';
import { Subject, debounceTime } from 'rxjs';

const DEBOUNCE_TIME = 100;

@Component({
  selector: 'app-navbar',
  imports: [ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly formBuilder = inject(FormBuilder);
  readonly taskService = inject(TaskService);
  readonly tasksStore = inject(TaskStore);

  searchForm: FormGroup;
  searchSubject = new Subject();

  constructor() {
    this.searchForm = this.formBuilder.group({
      search: this.formBuilder.control(''),
    });

    this.searchSubject.pipe(debounceTime(DEBOUNCE_TIME)).subscribe((event) => {
      const valueSearch = (event as any).target.value;
      this.tasksStore.filterTasks(valueSearch);
    });
  }

  handleLogout() {
    this.authService.logout();
  }

  handleSearchOnInput(event: Event) {
    this.searchSubject.next(event);
  }
}
