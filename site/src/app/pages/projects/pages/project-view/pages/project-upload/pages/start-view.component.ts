import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { FileInfo } from '@progress/kendo-angular-upload';
import { FileUploaded } from '../actions';
import { UploadStartViewComponent } from '@wbs/components/upload-views/start-view';

@Component({
  standalone: true,
  template: `<wbs-upload-start-view (fileUploaded)="onSelect($event)" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UploadStartViewComponent],
})
export class StartViewComponent {
  private readonly store = inject(Store);

  onSelect(file: FileInfo): void {
    this.store.dispatch(new FileUploaded(file));
  }
}
