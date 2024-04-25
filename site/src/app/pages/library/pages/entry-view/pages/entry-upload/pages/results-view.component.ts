import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { SignalStore } from '@wbs/core/services';
import { UploadResultsViewComponent } from '@wbs/main/components/upload-views/results-view';
import { LoadProjectFile } from '../actions';
import { EntryUploadState } from '../states';

@Component({
  standalone: true,
  template: `<wbs-upload-results-view
    [stats]="stats()"
    [errors]="errors()"
    [loading]="loading()"
    [fileType]="fileType()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UploadResultsViewComponent],
})
export class ResultsViewComponent implements OnInit {
  private readonly store = inject(SignalStore);

  readonly errors = this.store.select(EntryUploadState.errors);
  readonly loading = this.store.select(EntryUploadState.loadingFile);
  readonly stats = this.store.select(EntryUploadState.stats);
  readonly fileType = this.store.select(EntryUploadState.fileType);

  ngOnInit(): void {
    this.store.dispatch(new LoadProjectFile());
  }
}
