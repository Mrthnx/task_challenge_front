import {Component, inject, OnInit, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '@data/services/auth.service';
import {DialogComponent} from '@presentation/templates/dialog/dialog.component';
import {Router} from '@angular/router';
import {ModalService} from '../../../core/services/modal.service';

interface LoginForm {
  email: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './sign-in.component.html',
  standalone: true,
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {

  readonly formBuilder = inject(FormBuilder);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly modalService = inject(ModalService);

  loginForm!: FormGroup<LoginForm>;
  erorrMessage = signal('');

  ngOnInit() {
    this.initForm();
  }

  handleFormSubmit() {
    if (this.loginForm.invalid) return;
    this.erorrMessage.set('');

    this.authService
      .validateEmail(this.loginForm.value.email ?? '')
      .subscribe({
        next: res => {
          this.router.navigate(['/admin']);
        },
        error: err => {
          if (err.status === 401) {
            this.askForRegistration();
            return;
          }
          this.erorrMessage.set("Oops! Something went wrong, try again later.");
        }
      });
  }

  private initForm() {
    this.loginForm = this.formBuilder.group<LoginForm>({
      email: this.formBuilder.control('ejemplo@ejemplo.com', [
        Validators.required,
        Validators.email,
      ])
    });
  }

  private askForRegistration() {
    const modal = this.modalService.open(DialogComponent, {
      config: {
        title: 'Usuario no encontrado',
        message: 'El correo ingresado no existe, ¿deseas registrarlo?',
        okButtonText: 'Sí, registrar',
        cancelButtonText: 'Por ahora no',
      }
    });

    modal.afterClosed().subscribe(result => {
      if (result) {
        this.erorrMessage.set('');
        this.authService
          .registerEmail(this.loginForm.value.email ?? '')
          .subscribe({
            next: res => {
              this.router.navigate(['/admin']);
            }, error: err => {
              this.erorrMessage.set("Ocurrió un error, intenta de nuevo.");
            }
          });
      }
    });
  }
}
