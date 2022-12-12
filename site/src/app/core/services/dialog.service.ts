import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable } from 'rxjs';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(
    private readonly modalService: NgbModal,
    private readonly resources: Resources
  ) {}

  confirm(
    titleLabel: string,
    messageLabel: string,
    yesLabel = 'General.Yes',
    noLabel = 'General.No'
  ): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      const title = this.resources.get(titleLabel);
      const message = this.resources.get(messageLabel);
      const yes = this.resources.get(yesLabel);
      const no = this.resources.get(noLabel);

      //@ts-ignore
      Notiflix.Confirm.show(
        title,
        message,
        yes,
        no,
        () => {
          subscriber.next(true);
          subscriber.complete();
        },
        () => {
          subscriber.next(false);
          subscriber.complete();
        },
        {}
      );
    });
  }

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

    return from(dialog.result);
  }
}
