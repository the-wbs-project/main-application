import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { UploadOptionsViewComponent } from '@wbs/components/upload-views/options-view';
import { AppendOrOvewriteSelected } from '../actions';

@Component({
  standalone: true,
  template: `<wbs-upload-options-view (selected)="select($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UploadOptionsViewComponent],
})
export class OptionsViewComponent {
  private readonly store = inject(Store);

  select(answer: 'append' | 'overwrite'): void {
    this.store.dispatch(new AppendOrOvewriteSelected(answer));
  }
}
