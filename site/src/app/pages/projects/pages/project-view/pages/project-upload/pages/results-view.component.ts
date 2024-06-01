import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UploadResultsViewComponent } from '@wbs/components/upload-views/results-view';
import { SignalStore } from '@wbs/core/services';
import { LoadProjectFile } from '../actions';
import { ProjectUploadState } from '../states';

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

  readonly stats = this.store.select(ProjectUploadState.stats);
  readonly errors = this.store.select(ProjectUploadState.errors);
  readonly loading = this.store.select(ProjectUploadState.loadingFile);
  readonly fileType = this.store.select(ProjectUploadState.fileType);

  ngOnInit(): void {
    this.store.dispatch(new LoadProjectFile());
  }
}
