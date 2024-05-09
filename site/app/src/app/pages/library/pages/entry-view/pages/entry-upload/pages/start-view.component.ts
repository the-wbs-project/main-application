import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { FileInfo } from '@progress/kendo-angular-upload';
import { UploadStartViewComponent } from '@wbs/main/components/upload-views/start-view';
import { FileUploaded } from '../actions';

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
