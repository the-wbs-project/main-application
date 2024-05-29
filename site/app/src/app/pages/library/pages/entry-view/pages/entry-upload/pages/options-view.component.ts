import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { UploadOptionsViewComponent } from '@wbs/components/upload-views/options-view';
import { switchMap } from 'rxjs/operators';
import { AppendOrOvewriteSelected } from '../actions';
import { EntryUploadState } from '../states';

@Component({
  standalone: true,
  template: `<wbs-upload-options-view (selected)="select($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UploadOptionsViewComponent],
})
export class OptionsViewComponent {
  private readonly store = inject(Store);

  readonly entryUrl = input.required<string[]>();

  select(answer: 'append' | 'overwrite'): void {
    this.store
      .dispatch(new AppendOrOvewriteSelected(answer))
      .pipe(
        switchMap(() => this.store.selectOnce(EntryUploadState.fileType)),
        switchMap((fileType) =>
          this.store.dispatch(
            new Navigate([
              ...this.entryUrl(),
              'upload',
              fileType === 'excel' ? 'saving' : 'disciplines',
            ])
          )
        )
      )
      .subscribe();
  }
}
