import { Component, inject } from '@angular/core';
import { AuthService } from '@data/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly authService = inject(AuthService);

  handleLogout() {
    this.authService.logout();
  }
}
