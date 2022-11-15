import { Injectable } from '@angular/core';
import { Resources } from './resource.service';

@Injectable({ providedIn: 'root' })
export class Messages {
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
