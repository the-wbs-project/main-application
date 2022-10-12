import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable } from 'rxjs';
import { DialogComponent } from '../models';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class Messages {
  constructor(
    private readonly modalService: NgbModal,
    private readonly resources: Resources
  ) {}

  info(label: string, isResource = true): void {
    const x = isResource ? this.resources.get(label) : label;

    //@ts-ignore
    Notiflix.Notify.info(x);
  }

  error(label: string, isResource = true): void {
    const x = isResource ? this.resources.get(label) : label;

    //@ts-ignore
    Notiflix.Notify.failure(x);
  }

  success(label: string, isResource = true): void {
    const x = isResource ? this.resources.get(label) : label;

    //@ts-ignore
    Notiflix.Notify.success(x);
  }

  block(className: string): void {
    //@ts-ignore
    Notiflix.Block.hourglass(className);
  }

  unblock(className: string): void {
    //@ts-ignore
    Notiflix.Block.remove(className);
  }

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

  openDialog<T>(component: any, data?: any): Observable<T> {
    const dialog = this.modalService.open(component, {
      ariaLabelledBy: 'modal-title',
    });

    if (data) dialog.componentInstance.setup(data);

    return from(dialog.result);
  }
}
