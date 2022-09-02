import { Injectable } from '@angular/core';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { ContainerService } from '@wbs/shared/services';
import { map, Observable } from 'rxjs';
import { LabelDialogComponent } from './label-dialog.component';

@Injectable()
export class LabelDialogService {
  constructor(
    private readonly containers: ContainerService,
    private readonly dialogs: DialogService
  ) {}

  launchAsync(
    title: string,
    message: string,
    value: string
  ): Observable<string | null | undefined> {
    const dialog = this.dialogs.open({
      content: LabelDialogComponent,
      appendTo: this.containers.body,
    });
    const component = <LabelDialogComponent>dialog.content.instance;

    component.message = message;
    component.title = title;
    component.value = value;

    return dialog.result.pipe(
      map((x: DialogCloseResult | 'save') =>
        x instanceof DialogCloseResult ? null : component.value
      )
    );
  }
}
