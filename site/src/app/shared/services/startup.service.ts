import { Injectable } from '@angular/core';
import { ListItem, ProjectLite, User } from '@wbs/models';

@Injectable({ providedIn: 'root' })
export class StartupService {
  private _categoriesDiscipline: ListItem[] | undefined;
  private _categoriesPhase: ListItem[] | undefined;
  private _projectsMy: ProjectLite[] | undefined;
  private _projectsWatched: ProjectLite[] | undefined;
  private _resources: any | undefined;
  private _user: User | undefined;

  constructor() {
    this.initiate();
  }

  get categoriesDiscipline(): ListItem[] | undefined {
    return this._categoriesDiscipline;
  }

  get categoriesPhase(): ListItem[] | undefined {
    return this._categoriesPhase;
  }

  get projectsMy(): ProjectLite[] | undefined {
    return this._projectsMy;
  }

  get projectsWatched(): ProjectLite[] | undefined {
    return this._projectsWatched;
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
      this._categoriesDiscipline = data.categoriesDiscipline;
      this._categoriesPhase = data.categoriesPhase;
      this._projectsMy = data.projects;
      this._resources = data.resources;
      this._user = data.user;
      console.log(data);
    }
  }
}
