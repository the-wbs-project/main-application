import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { AuthState } from '@wbs/shared/states';
import { AuthDataService } from './auth.data-service';
import { ExtractDataService } from './extract.data-service';
import { MetdataDataService } from './metdata.data-service';
import { ProjectDataService } from './project.data-service';
import { ProjectNodeDataService } from './project-node.data-service';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class DataServiceFactory {
  readonly auth = new AuthDataService(this.http);
  readonly extracts = new ExtractDataService(this.http);
  readonly metdata = new MetdataDataService(this.http);
  readonly projects = new ProjectDataService(this.http);
  readonly projectNodes = new ProjectNodeDataService(this.http);

  public constructor(private readonly http: HttpClient) {}
}
