import { Injectable } from '@angular/core';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ListItem } from '@wbs/shared/models';
import { ContainerService } from '@wbs/shared/services';
import { map, Observable } from 'rxjs';
import { WbsNodeDeleteComponent } from './component';

@Injectable()
export class WbsNodeDeleteService {
  constructor(
    private readonly containers: ContainerService,
    private readonly dialogs: DialogService
  ) {}

  launchAsync(deleteReasons: ListItem[]): Observable<string | null> {
    const dialog = this.dialogs.open({
      content: WbsNodeDeleteComponent,
      appendTo: this.containers.body,
    });
    const component = <WbsNodeDeleteComponent>dialog.content.instance;

    component.reasons$.next(deleteReasons);

    return dialog.result.pipe(
      map((x: DialogCloseResult | 'save') =>
        x instanceof DialogCloseResult ? null : x
      )
    );
  }
}
