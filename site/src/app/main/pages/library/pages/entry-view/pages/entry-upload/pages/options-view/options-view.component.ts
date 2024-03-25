import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { switchMap } from 'rxjs/operators';
import { AppendOrOvewriteSelected } from '../../actions';
import { EntryUploadState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './options-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
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
