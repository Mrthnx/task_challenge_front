import { Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ModalRef } from 'src/app/core/classes/modal-ref';

interface ModalConfig {
  title: string;
  message: string;
  okButtonText: string;
  cancelButtonText: string;
}

@Component({
  selector: 'app-dialog',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './dialog.component.html',
  standalone: true,
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  readonly modalRef = inject(ModalRef);

  isOpen = input<boolean>(true);
  config = input<ModalConfig>({
    title: '',
    message: '',
    okButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
  });

  handleClose(ok: boolean) {
    this.modalRef.close(ok);
  }
}
