import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContainerService {
  private _body: ViewContainerRef | undefined;

  register(body: ViewContainerRef | undefined) {
    this._body = body;
  }

  get body(): ViewContainerRef | undefined {
    return this._body;
  }
}
