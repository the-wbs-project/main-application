import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Resources } from '@wbs//core/services';
import { from, Observable } from 'rxjs';

@Injectable()
export class DialogService {
  constructor(
    private readonly modalService: NgbModal,
    private readonly resources: Resources
  ) {}

  confirm(
    titleLabel: string,
    messageLabel: string,
    data?: Record<string, string>,
    yesLabel = 'General.Yes',
    noLabel = 'General.No'
  ): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      const title = this.resources.get(titleLabel);
      let message = this.resources.get(messageLabel);
      const yes = this.resources.get(yesLabel);
      const no = this.resources.get(noLabel);

      if (data) {
        for (const prop of Object.keys(data)) {
          message = message.replace(`{${prop}}`, data[prop]);
        }
      }

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

    return from(dialog.closed);
  }
}
