import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ContainerService } from '@wbs/shared/services';
import { map, Observable, of } from 'rxjs';
import { ProjectState } from '../../projects/states';
import { WbsNodeDeleteComponent } from './component';

@Injectable()
export class WbsNodeDeleteService {
  constructor(
    private readonly containers: ContainerService,
    private readonly dialogs: DialogService,
    private readonly store: Store
  ) {}

  launchAsync(nodeId: string): Observable<string | null> {
    //TODO should not be calling project state from feature
    const nodes = this.store.selectSnapshot(ProjectState.nodes)!;
    const node = nodes.find((x) => x.id === nodeId);

    if (!node) return of(null);

    return this.dialogs
      .open({
        content: WbsNodeDeleteComponent,
        appendTo: this.containers.body,
      })
      .result.pipe(
        map((x: DialogCloseResult | 'save') =>
          x instanceof DialogCloseResult ? null : x
        )
      );
  }
}
