import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { LabelModule } from '@progress/kendo-angular-label';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Resources, sorter } from '@wbs/core/services';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, map } from 'rxjs';

declare type Item = { id: string; label: string; order: number };

@Component({
  standalone: true,
  templateUrl: './task-delete.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    DropDownListModule,
    FormsModule,
    LabelModule,
    TranslateModule,
  ],
})
export class TaskDeleteComponent extends DialogContentBase implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly resources = inject(Resources);

  readonly dOtherId = 'delete_other';
  readonly reason = model<string>();
  readonly other = model<string>();
  readonly showReason = computed(() => this.reason() === this.dOtherId);
  readonly disableSubmit = computed(() => {
    const reason = this.reason();

    return !reason || (reason === this.dOtherId && !this.other());
  });

  readonly reasons = toSignal(
    this.data.metdata
      .getListAsync<Item>('delete_reasons')
      .pipe(map((list) => list.sort((a, b) => sorter(a.order, b.order))))
  );

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  ngOnInit(): void {
    this.other.set('');
  }

  static launchAsync(dialog: DialogService): Observable<string | undefined> {
    const ref = dialog.open({
      content: TaskDeleteComponent,
    });

    return ref.result.pipe(
      map((x: unknown) => (x instanceof DialogCloseResult ? undefined : <any>x))
    );
  }

  finishDelete() {
    const dReasonId = this.reason();
    const otherReasonText = this.other()!;

    if (dReasonId)
      if (dReasonId === this.dOtherId) {
        this.dialog.close(otherReasonText.trim());
      } else {
        const dReason = this.reasons()!.find((x) => x.id === dReasonId)!;

        this.dialog.close(this.resources.get(dReason.label));
      }
  }
}
