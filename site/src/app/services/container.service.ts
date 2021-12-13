import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContainerService {
  private _template: ViewContainerRef | undefined;
  private _body: ViewContainerRef | undefined;

  register(
    template: ViewContainerRef | undefined,
    body: ViewContainerRef | undefined
  ) {
    this._template = template;
    this._body = body;
  }

  get template(): ViewContainerRef | undefined {
    return this._template;
  }

  get body(): ViewContainerRef | undefined {
    return this._body;
  }
}
