import { Injectable } from '@angular/core';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ListItem } from '@wbs/shared/models';
import { ContainerService, DataServiceFactory } from '@wbs/shared/services';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { WbsNodeDeleteComponent } from './component';

@Injectable()
export class WbsNodeDeleteService {
  private deleteReasons?: ListItem[];

  constructor(
    private readonly containers: ContainerService,
    private readonly data: DataServiceFactory,
    private readonly dialogs: DialogService
  ) {}

  launchAsync(): Observable<string | null> {
    return this.getReasons().pipe(
      switchMap((list) => {
        const dialog = this.dialogs.open({
          content: WbsNodeDeleteComponent,
          appendTo: this.containers.body,
        });
        const component = <WbsNodeDeleteComponent>dialog.content.instance;

        component.reasons$.next(list);

        return dialog.result.pipe(
          map((x: DialogCloseResult | 'save') =>
            x instanceof DialogCloseResult ? null : x
          )
        );
      })
    );
  }

  private getReasons(): Observable<any> {
    if (this.deleteReasons && this.deleteReasons.length > 0)
      return of(this.deleteReasons);

    return this.data.metdata
      .getListAsync('delete_reasons')
      .pipe(tap((list) => (this.deleteReasons = list)));
  }
}
