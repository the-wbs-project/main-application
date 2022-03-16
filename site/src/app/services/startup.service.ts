import { Injectable } from '@angular/core';
import { User } from '@app/models';
import { Project } from '@app/models/project.model';

@Injectable({ providedIn: 'root' })
export class StartupService {
  private _myProjects: Project[] | undefined;
  private _watchedProjects: Project[] | undefined;
  private _resources: any | undefined;
  private _user: User | undefined;

  constructor() {
    this.initiate();
  }

  get myProjects(): Project[] | undefined {
    return this._myProjects;
  }

  get resources(): any | undefined {
    return this._resources;
  }

  get user(): User | undefined {
    return this._user;
  }

  get watchedProjects(): Project[] | undefined {
    return this._watchedProjects;
  }

  private initiate(): void {
    const elem = document.getElementById('edge_state');

    if (elem?.innerHTML) {
      const data = JSON.parse(elem.innerHTML);
      this._myProjects = data.myProjects;
      this._resources = data.resources;
      this._user = data.user;
      this._watchedProjects = data.watchedProjects;
      console.log(data);
    }
  }
}
