import { Injectable } from '@angular/core';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class StartupService {
  private _resources: any | undefined;
  private _user: User | undefined;

  constructor() {
    this.initiate();
  }

  get resources(): any | undefined {
    return this._resources;
  }

  get user(): User | undefined {
    return this._user;
  }

  private initiate(): void {
    const elem = document.getElementById('edge_state');

    if (elem?.innerHTML) {
      const data = JSON.parse(elem.innerHTML);
      this._resources = data.resources;
      this._user = data.user;
      console.log(data);
    }
  }
}
