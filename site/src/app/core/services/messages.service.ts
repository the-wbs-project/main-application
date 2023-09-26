import { Injectable } from '@angular/core';
import { Resources } from './resource.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Messages {
  readonly notify = new Toasts(this.resources);
  readonly confirm = new Confirm(this.resources);
  readonly report = new Report(this.resources);

  constructor(private readonly resources: Resources) {}

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
}

class Toasts {
  constructor(private readonly resources: Resources) {}

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
}

class Confirm {
  constructor(private readonly resources: Resources) {}

  show(
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
}

class Report {
  constructor(private readonly resources: Resources) {}

  failure(
    titleLabel: string,
    messageLabel: string,
    data?: Record<string, string>,
    okayLabel = 'General.Okay'
  ): void {
    const title = this.resources.get(titleLabel);
    let message = this.resources.get(messageLabel);
    const ok = this.resources.get(okayLabel);

    if (data) {
      for (const prop of Object.keys(data)) {
        message = message.replace(`{${prop}}`, data[prop]);
      }
    }
    //@ts-ignore
    Notiflix.Report.failure(title, message, ok);
  }

  success(
    titleLabel: string,
    messageLabel: string,
    data?: Record<string, string>,
    okayLabel = 'General.Okay'
  ): void {
    const title = this.resources.get(titleLabel);
    let message = this.resources.get(messageLabel);
    const ok = this.resources.get(okayLabel);

    if (data) {
      for (const prop of Object.keys(data)) {
        message = message.replace(`{${prop}}`, data[prop]);
      }
    }
    //@ts-ignore
    Notiflix.Report.success(title, message, ok);
  }
}
