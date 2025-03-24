import { ComponentRef } from '@angular/core';
import { ModalRef } from './modal-ref';

describe('ModalRef', () => {
  let modalRef: ModalRef<any>;
  let mockComponentRef: jasmine.SpyObj<ComponentRef<any>>;

  beforeEach(() => {
    modalRef = new ModalRef<any>();
    mockComponentRef = jasmine.createSpyObj<ComponentRef<any>>('ComponentRef', [
      'destroy',
    ]);
    modalRef.setComponentRef(mockComponentRef);
  });

  it('should set the component reference', () => {
    expect(modalRef).toBeTruthy();
  });

  it('should return an observable from afterClosed', (done) => {
    modalRef.afterClosed().subscribe((result) => {
      expect(result).toBe('test');
      done();
    });

    modalRef.close('test');
  });

  it('should call destroy and complete subject on close', () => {
    modalRef.close('closed');

    expect(mockComponentRef.destroy).toHaveBeenCalled();
  });
});
