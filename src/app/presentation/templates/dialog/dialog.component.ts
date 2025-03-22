import {Component, input, output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

interface ModalConfig {
  title: string;
  message: string;
  okButtonText: string;
  cancelButtonText: string;
}

@Component({
  selector: 'app-dialog',
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './dialog.component.html',
  standalone: true,
  styleUrl: './dialog.component.css'
})
export class DialogComponent {

  isOpen = input<boolean>(true);
  config = input<ModalConfig>({
    title: '',
    message: '',
    okButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar'
  });

  onAccept = output();
  onCancel = output();

}
