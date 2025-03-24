import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { ModalRef } from '../../../core/classes/modal-ref';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockModalRef: jasmine.SpyObj<ModalRef<any>>;

  beforeEach(async () => {
    mockModalRef = jasmine.createSpyObj<ModalRef<any>>('ModalRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      providers: [{ provide: ModalRef, useValue: mockModalRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default config values', () => {
    expect(component.config()).toEqual({
      title: '',
      message: '',
      okButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    });
  });

  it('should call modalRef.close(true) when OK is clicked', () => {
    component.handleClose(true);
    expect(mockModalRef.close).toHaveBeenCalledWith(true);
  });

  it('should call modalRef.close(false) when Cancel is clicked', () => {
    component.handleClose(false);
    expect(mockModalRef.close).toHaveBeenCalledWith(false);
  });

  it('should accept custom config via input', () => {
    fixture.componentRef.setInput('config', {
      title: 'Hola',
      message: '¿Estás seguro?',
      okButtonText: 'Sí',
      cancelButtonText: 'No',
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.config().title).toBe('Hola');
    expect(component.config().okButtonText).toBe('Sí');
  });
});
