import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { AuthState } from '@wbs/shared/states';
import { ProjectDataService } from './project.data-service';
import { MetdataDataService } from './metdata.data-service';
import { ProjectNodeDataService } from './project-node.data-service';
import { ExtractDataService } from './extract.data-service';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly extracts = new ExtractDataService(this.http);
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
        this.extracts.setOwner(owner);
        this.projects.setOwner(owner);
        this.projectNodes.setOwner(owner);
      });
  }
}
