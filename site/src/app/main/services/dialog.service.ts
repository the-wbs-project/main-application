import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable } from 'rxjs';

@Injectable()
export class DialogService {
  constructor(private readonly modalService: NgbModal) {}

  openDialog<T>(
    component: any,
    options?: NgbModalOptions,
    data?: any
  ): Observable<T> {
    const dialog = this.modalService.open(component, {
      ...options,
      ariaLabelledBy: 'modal-title',
    });

    if (data) dialog.componentInstance.setup(data);

    return from(dialog.closed);
  }
}
