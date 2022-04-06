import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { AuthState } from '@wbs/states';
import { ProjectDataService } from './project.data-service';
import { ResourcesDataService } from './resources.data-service';
import { WbsDataService } from './wbs.data-service';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly project: ProjectDataService;
  readonly resources: ResourcesDataService;
  readonly wbs: WbsDataService;

  public constructor(http: HttpClient, private readonly store: Store) {
    this.project = new ProjectDataService(http);
    this.resources = new ResourcesDataService(http);
    this.wbs = new WbsDataService(http);
  }

  initialize() {
    this.store
      .select(AuthState.organization)
      .pipe(untilDestroyed(this))
      .subscribe((owner) => {
        this.project.setOwner(owner);
        this.wbs.setOwner(owner);
      });
  }
}
