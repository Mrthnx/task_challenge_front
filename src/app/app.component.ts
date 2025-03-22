import {AfterViewInit, Component, inject, viewChild, ViewContainerRef} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ModalService} from './core/services/modal.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  readonly modalContainerRef = viewChild('modalContainer', {read: ViewContainerRef});
  readonly modalService = inject(ModalService);

  ngAfterViewInit() {
    this.modalService.setViewContainerRef(this.modalContainerRef());
  }
}
