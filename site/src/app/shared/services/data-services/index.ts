import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { AuthState } from '@wbs/states';
import { ProjectDataService } from './project.data-service';
import { MetdataDataService } from './metdata.data-service';
import { ProjectNodeDataService } from './project-node.data-service';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly metdata = new MetdataDataService(this.http);
  readonly projects = new ProjectDataService(this.http);
  readonly projectNodes = new ProjectNodeDataService(this.http);

  public constructor(
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}

  initialize() {
    this.store
      .select(AuthState.organization)
      .pipe(untilDestroyed(this))
      .subscribe((owner) => {
        this.projects.setOwner(owner);
        this.projectNodes.setOwner(owner);
      });
  }
}
