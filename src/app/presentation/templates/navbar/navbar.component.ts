import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@data/services/auth.service';
import { TaskStore } from '@data/store/tasks.store';
import { debounceTime } from 'rxjs';

const DEBOUNCE_TIME = 100;

@Component({
  selector: 'app-navbar',
  imports: [ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly formBuilder = inject(FormBuilder);
  readonly tasksStore = inject(TaskStore);

  searchControl!: FormControl<string | null>;

  ngOnInit() {
    this.initSeachControl();
  }

  handleLogout() {
    this.authService.logout();
  }

  private initSeachControl() {
    this.searchControl = this.formBuilder.control<string>('');
    this.searchControl.valueChanges
      .pipe(debounceTime(DEBOUNCE_TIME))
      .subscribe((value) => {
        this.tasksStore.query.set(value ?? '');
      });
  }
}
